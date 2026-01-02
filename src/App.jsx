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
      isCompleted: false,
    }
    setTodoList([...todoList, newTodo])
  }

  function completeTodo(id) {
    const updateTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return {...todo, isCompleted: true}
      }
      return todo
    })

    setTodoList(updateTodos);
  }

  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList}
        onCompleteTodo={completeTodo}
      />
    </div>
  )
}

export default App
