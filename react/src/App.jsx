import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = () => {
    const todo = { id: todos.length + 1, text: newTodo };
    axios.post('http://127.0.0.1:5000/todos', todo)
      .then(response => setTodos([...todos, response.data]))
      .catch(error => console.error('Error adding todo:', error));
    setNewTodo('');
  };

  const deleteTodo = (id) => {
    axios.delete(`http://127.0.0.1:5000/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(error => console.error('Error deleting todo:', error));
  };

  const toggleDone = (id) => {
    const todo = todos.find(todo => todo.id === id);
    axios.put(`http://127.0.0.1:5000/todos/${id}`, { ...todo, done: !todo.done })
      .then(response => setTodos(todos.map(todo => todo.id === id ? response.data : todo)))
      .catch(error => console.error('Error toggling done:', error));
  };

  const startEditing = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const editTodo = () => {
    axios.put(`http://127.0.0.1:5000/todos/${editTodoId}`, { text: editTodoText })
      .then(response => setTodos(todos.map(todo => todo.id === editTodoId ? response.data : todo)))
      .catch(error => console.error('Error editing todo:', error));
    setEditTodoId(null);
    setEditTodoText('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <h1 className="text-2xl top-0 fixed mb-4 bg-gray-900 text-white w-full text-center py-2">Todo List</h1>
      <div className="mb-4 w-full max-w-max fixed top-12 space-x-2"> 
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow border rounded px-2 py-1"
        />
        <button onClick={addTodo} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600">Add</button>
      </div>
      <ul className="w-full fixed top-24  space-y-4  max-h bg-gray-400 p-4 rounded overflow-x-visible">
        {todos.map(todo => (
          <li key={todo.id} className="flex justify-between items-center p-2 bg-white rounded shadow">
            {editTodoId === todo.id ? (
              <div className="flex space-x-2 w-full">
                <input
                  type="text"
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                  className="flex-grow border rounded px-2 py-1 bg-gray-800 text-white"
                />
                <button onClick={editTodo} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <span className={`flex-grow ${todo.done ? 'line-through' : ''}`}>{todo.text}</span>
                <div className="flex space-x-2">
                  <button onClick={() => startEditing(todo.id, todo.text)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                  <button onClick={() => toggleDone(todo.id)} className="bg-purple-500 text-white px-4 py-2 rounded">{todo.done ? 'Undo' : 'Done'}</button>
                  <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
