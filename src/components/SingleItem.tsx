import React, { useEffect, useRef, useState } from 'react'
import { Todo } from '../models/model'
import {AiFillEdit,AiFillDelete} from "react-icons/ai"
import {MdDone} from "react-icons/md"

interface Props{
        item:Todo,
        todos:Todo[];
        setTodos:React.Dispatch<React.SetStateAction<Todo[]>>;
}



const SingleItem:React.FC<Props> = ({item, todos,setTodos}:Props) => {
        const [edit, setEdit] = useState<boolean>(false)
        const [editTodo, setEditTodo] = useState<string>(item.todo);

        const handleDone =(id:number)=>{
                setTodos(todos.map(todo=>todo.id===id?{...todo,isDone:!item.isDone}:todo))
        }
        const handleEdit = (e: React.FormEvent, id: number) => {
                e.preventDefault();
                setTodos(todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo)));
                setEdit(false);
        };
        const handleDelete =(id:number)=>{
                setTodos(todos.filter(todo=>todo.id!==id))
        }

        const inputRef=useRef<HTMLInputElement>(null)

        useEffect(() => {
                inputRef.current?.focus();
        }, [edit])
        

  return (
        <form className='todos__single' onSubmit={(e) => handleEdit(e, item.id)}>
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
          <div>
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