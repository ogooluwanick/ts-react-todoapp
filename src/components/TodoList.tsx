import React from 'react'
import { Todo } from '../models/model'
import SingleItem from './SingleItem'

// interface 

interface Props{
        todos:Todo[],
        setTodos:React.Dispatch<React.SetStateAction<Todo[]>>,
}

const TodoList:React.FC<Props> = ({todos,setTodos}:Props) => {
  return (
        <div className='todos'>
        {
                todos.map(item=>(
                        <SingleItem item={item} key={item.id} todos={todos} setTodos={setTodos}/>
                ))
        }
        </div>
  )
}

export default TodoList