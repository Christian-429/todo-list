import './App.css'
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'
import { useState } from 'react'  


function App() {
  const [newTodo, setNewTodo] = useState("hello");

  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  )
}

export default App
