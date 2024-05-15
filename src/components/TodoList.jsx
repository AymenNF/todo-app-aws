import React from 'react';
import './TodoList.css';

const TodoList = ({ todos, deleteTodo }) => {
  return (
    <ul className="todo-list">
      {todos.map((todo, index) => (
        <li key={index} className="todo-item">
          {todo}
          <button onClick={() => deleteTodo(index)} className="delete-button">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
