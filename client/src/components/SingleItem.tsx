import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment'; // Import moment
import { Todo } from '../models/model';
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import "./styles.css"; // Assuming styles.css is in the same directory

interface Props {
    item: Todo;
    onUpdate: (id: string, updates: { task?: string; isDone?: boolean }) => Promise<void>; // Changed todo to task
    onDelete: (id: string) => Promise<void>;
}

const SingleItem: React.FC<Props> = ({ item, onUpdate, onDelete }: Props) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(item.todo);

    const handleDone = async (id: string) => {
        try {
            await onUpdate(id, { isDone: !item.isDone });
            // Parent (TodoAppPage) will handle state update
        } catch (error) {
            console.error("Failed to mark todo as done:", error);
            // Optionally show an error to the user
        }
    };

    const handleEditSubmit = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        if (editTodo.trim() === item.todo) {
            setEdit(false);
            return;
        }
        try {
            await onUpdate(id, { task: editTodo.trim() }); // Changed todo to task
            setEdit(false);
            // Parent (TodoAppPage) will handle state update
        } catch (error) {
            console.error("Failed to edit todo:", error);
            // Optionally show an error to the user
            // Revert editTodo if needed or keep it for retry
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await onDelete(id);
                // Parent (TodoAppPage) will handle state update
            } catch (error) {
                console.error("Failed to delete todo:", error);
                // Optionally show an error to the user
            }
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
                inputRef.current?.focus();
        }, [edit])
        
  return (
    <form className='todos__single' onSubmit={(e) => handleEditSubmit(e, item.id)}>
      <div className="todos_main">

                {
                        edit ? (
                                <input
                                        value={editTodo}
                                        onChange={(e) => setEditTodo(e.target.value)}
                                        className="todos__single--text"
                                        ref={inputRef}
                                />
                        ) 
                        : 
                        item.isDone ? (
                                <s className="todos__single--text">{item.todo}</s>
                                ) : 
                                (<span className="todos__single--text">{item.todo}</span>)
                }

                {item.createdAt && (
                    <div className="todo__timestamp">
                        Created: {moment(item.createdAt).fromNow()}
                    </div>
        )}
      </div>
        
          <div className="icons-container">
            <span
              className="icon"
              onClick={() => {
                if (!edit && !item.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(item.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(item.id)}>
              <MdDone />
            </span>
          </div>
        </form>
  )
}

export default SingleItem
