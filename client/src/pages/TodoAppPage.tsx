import React, { useState, useEffect, FormEvent } from 'react';
import InputField from '../components/InputField';
import TodoList from '../components/TodoList';
import { Todo as TodoModel } from "../models/model"; // Renaming to avoid conflict with backend Todo model if different
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Assuming App.css contains relevant styles

// TodoModel from src/models/model.ts now has id: string
// We'll ensure our components use this updated model.

const TodoAppPage: React.FC = () => {
    const [todo, setTodo] = useState<string>("");
    const [todos, setTodos] = useState<TodoModel[]>([]); // Use TodoModel directly
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTodos();
            // Ensure the fetched todos match the BackendTodo structure
            // The id from frontend model might be 'number', backend is '_id' (string)
            // We map it here to fit the existing TodoModel structure if needed,
            // or adjust TodoModel and components to use _id directly.
            // For now, let's assume components can handle _id as string for id.
            // Map backend's _id to frontend's id
            const fetchedTodos: TodoModel[] = response.data.map((t: any) => ({
                id: t._id, // Ensure this mapping happens
                todo: t.task,
                isDone: t.isDone,
                createdAt: t.createdAt, // Add createdAt mapping
                // Include other fields from TodoModel if they exist and are sent by backend
            }));
            setTodos(fetchedTodos);
        } catch (err: any) {
            console.error("Failed to fetch todos:", err);
            setError(err.response?.data?.message || "Failed to fetch todos.");
            if (err.response?.status === 401) { // Unauthorized
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (e: FormEvent) => {
        e.preventDefault();
        if (todo.trim()) {
            try {
                const response = await createTodo({ task: todo, isDone: false });
                // Map backend's _id to frontend's id for the new todo
                const newTodo: TodoModel = {
                    id: response.data._id,
                    todo: response.data.task,
                    isDone: response.data.isDone,
                    createdAt: response.data.createdAt, // Add createdAt mapping
                };
                setTodos([newTodo, ...todos]); // Add to the beginning
                setTodo("");
            } catch (err: any) {
                console.error("Failed to add todo:", err);
                setError(err.response?.data?.message || "Failed to add todo.");
            }
        }
    };

    const handleUpdateTodo = async (id: string, updates: { task?: string; isDone?: boolean }) => { // Changed todo to task in updates type
        try {
            // Ensure the updates object is correctly structured for the API call
            // The api.ts updateTodo expects { task?: string; isDone?: boolean }
            const response = await updateTodo(id, updates);
            const updatedTodoFromServer = response.data;
            setTodos(prevTodos =>
                prevTodos.map(t =>
                    t.id === updatedTodoFromServer._id
                        ? { ...t, todo: updatedTodoFromServer.task, isDone: updatedTodoFromServer.isDone, createdAt: updatedTodoFromServer.createdAt } // Ensure createdAt is preserved/updated
                        : t
                )
            );
        } catch (err: any) {
            console.error("Failed to update todo:", err);
            setError(err.response?.data?.message || "Failed to update todo. Please try again.");
            // Optionally, revert optimistic updates or refetch todos
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteTodo(id);
            setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
        } catch (err: any) {
            console.error("Failed to delete todo:", err);
            setError(err.response?.data?.message || "Failed to delete todo. Please try again.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="App"><p>Loading todos...</p></div>;
    // Error display can be more sophisticated
    if (error && !todos.length) return <div className="App"><p>Error: {error} <button onClick={fetchTodos}>Retry</button></p></div>;


    return (
        <div className="App">
            <div className="header-container">
                <h1 className="heading">Todowy</h1>
          <div className="user_auth">
                {user && <span className="user-greeting">Hi, {user.username}!</span>}
                <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </div>
            {error && <p className="error-message-inline">{error}</p>}
            <InputField todo={todo} setTodo={setTodo} handleAddTodo={handleAddTodo} />
            <TodoList
                todos={todos}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
            />
        </div>
    );
};

export default TodoAppPage;
