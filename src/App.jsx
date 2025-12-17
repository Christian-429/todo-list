import './App.css'
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'
import { useState } from 'react'  


function App() {
  const [todoList, setTodoList] = useState([])

  function addTodo(title) {
    const newTodo = {
      title,
      id: Date.now(),
    }
    setTodoList([...todoList, newTodo])
  }

  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList}/>
    </div>
  )
}

export default App
