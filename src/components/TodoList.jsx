import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [updatedTask, setUpdatedTask] = useState('');

  const apiId = '0beh69w4g5';  
  const region = 'us-east-1';  

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`https://${apiId}.execute-api.${region}.amazonaws.com/prod/todos`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched todos:', data); // Debug log
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (newTask.trim() !== '') {
      const newTodo = { title: newTask };
      try {
        const response = await fetch(`https://${apiId}.execute-api.${region}.amazonaws.com/prod/todos`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
          throw new Error('Error adding todo');
        }

        setNewTask('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://${apiId}.execute-api.${region}.amazonaws.com/prod/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      setTodos(todos.filter((todo) => todo.id.S !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id, updatedTask, completed) => {
    try {
      const response = await fetch(`https://${apiId}.execute-api.${region}.amazonaws.com/prod/todos/${id}`, {
        method: 'PUT',
        headers: {
          
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ title: updatedTask, completed }),
      });
      if (response.ok) {
        fetchTodos();
        setEditingId(null);
        setUpdatedTask('');
      } else {
        throw new Error('Error updating todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const completeTodo = async (id) => {
    const todo = todos.find((todo) => todo.id.S === id);
    if (todo) {
      try {
        const response = await fetch(`https://${apiId}.execute-api.${region}.amazonaws.com/prod/todos/${id}/complete`, {
          method: 'PUT',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        });
        if (!response.ok) {
          throw new Error('Error completing todo');
        }
        const result = await response.json();
        setTodos(
          todos.map((todo) =>
            todo.id.S === id ? { ...todo, completed: result.completed } : todo
          )
        );
      } catch (error) {
        console.error('Error completing todo:', error);
      }
    }
  };

  const handleEdit = (id, task) => {
    setEditingId(id);
    setUpdatedTask(task);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter todo..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 mr-2 focus:outline-none"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none">
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id.S} className="flex items-center justify-between border-b border-gray-300 py-2">
            {editingId === todo.id.S ? (
              <input
                type="text"
                value={updatedTask}
                onChange={(e) => setUpdatedTask(e.target.value)}
                onBlur={() => updateTodo(todo.id.S, updatedTask, todo.completed.BOOL)}
                autoFocus
                className="flex-1 border-b-0 px-2 py-1 focus:outline-none"
              />
            ) : (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed.BOOL}
                  onChange={() => completeTodo(todo.id.S)}
                  className="mr-2"
                />
                <span
                  onClick={() => handleEdit(todo.id.S, todo.title.S)}
                  className={todo.completed.BOOL ? 'line-through cursor-pointer' : 'cursor-pointer'}
                >
                  {todo.title.S}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id.S)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
