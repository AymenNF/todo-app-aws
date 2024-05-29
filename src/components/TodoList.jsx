import React, { useState } from 'react';

const TodoList = ({ todos, fetchTodos }) => {
  const [editingId, setEditingId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState('');

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`https://195xytw3vc.execute-api.us-east-1.amazonaws.com/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id, updatedTask, completed) => {
    try {
      const response = await fetch(`https://195xytw3vc.execute-api.us-east-1.amazonaws.com/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: updatedTask, completed }),
      });
      if (response.status === 200) {
        fetchTodos();
        setEditingId(null);
        setUpdatedTask('');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const completeTodo = async (id) => {
    try {
      const response = await fetch(`https://195xytw3vc.execute-api.us-east-1.amazonaws.com/todos/${id}/complete`, {
        method: 'PUT',
      });
      if (response.status === 200) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  const handleEdit = (id, task) => {
    setEditingId(id);
    setUpdatedTask(task);
  };

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className="todo-item">
          {editingId === todo.id ? (
            <input
              type="text"
              value={updatedTask}
              onChange={(e) => setUpdatedTask(e.target.value)}
            />
          ) : (
            <span>{todo.task}</span>
          )}
          <button onClick={() => deleteTodo(todo.id)} className="delete-button">
            Delete
          </button>
          {editingId === todo.id ? (
            <button
              onClick={() => updateTodo(todo.id, updatedTask, todo.completed)}
              className="update-button"
            >
              Update
            </button>
          ) : (
            <button onClick={() => handleEdit(todo.id, todo.task)} className="edit-button">
              Edit
            </button>
          )}
          <button onClick={() => completeTodo(todo.id)} className="complete-button">
            Complete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
