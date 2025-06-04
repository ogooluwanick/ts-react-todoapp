import React from 'react'
import { Todo } from '../models/model'
import SingleItem from './SingleItem'

interface Props {
    todos: Todo[];
    // setTodos is removed as state updates will be handled by onUpdate/onDelete callbacks
    onUpdate: (id: string, updates: { todo?: string; isDone?: boolean }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<Props> = ({ todos, onUpdate, onDelete }: Props) => {
    return (
        <div className='todos'>
            {todos.map(item => (
                <SingleItem
                    item={item}
                    key={item.id}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TodoList;
