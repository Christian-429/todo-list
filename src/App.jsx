import './App.css'

function App() {
  const todos = [
    {id: 1, title: "Drink coffee"},
    {id: 2, title: "study physics"},
    {id: 3, title: "code out app"},
  ]
  return (
    <div>
      <h1>To Do List</h1>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  )
}

export default App
