import './App.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import TodosViewForm from './features/TodosViewForm.jsx'
import { useState, useEffect, useCallback } from 'react'




function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [sortField, setSortField] = useState("createdTime")
  const [sortDirection, setSortDirection] = useState("desc")
  const [queryString, setQueryString] = useState("")

  const token = `Bearer ${import.meta.env.VITE_PAT}`

  const encodeUrl = useCallback(() =>{
    let searchQuery = "";
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }

  return encodeURI(
    `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}?sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}${searchQuery}`
  )
  },[sortField, sortDirection, queryString])

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true)
      const options = {
        method: "GET",
        headers: { Authorization: token },
      }

      try {
        const resp = await fetch(encodeUrl(), options)
        if (!resp.ok) throw new Error(resp.statusText || "Failed to fetch todos")

        const data = await resp.json()
        const todos = data.records.map((record) => ({
          id: record.id,
          title: record.fields.title || "",
          isCompleted: record.fields.isCompleted || false,
          createdTime: record.fields.createdTime || record.createdTime,
        }))
        setTodoList(todos)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [sortField, sortDirection, queryString])

  const addTodo = async (newTodo) => {
    setIsSaving(true)
    const payload = {
      records: [{ fields: { title: newTodo.title, isCompleted: newTodo.isCompleted } }],
    }
    const options = { method: "POST", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify(payload) }

    try {
      const resp = await fetch(encodeUrl(), options)
      if (!resp.ok) throw new Error(resp.statusText || "Failed to add todo")
      const { records } = await resp.json()
      const savedTodo = { id: records[0].id, ...records[0].fields }
      if (!records[0].fields.isCompleted) savedTodo.isCompleted = false
      setTodoList([...todoList, savedTodo])
    } catch (error) {
      setErrorMessage(error.message || "Failed to save todo")
    } finally {
      setIsSaving(false)
    }
  }

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((t) => t.id === id)
    if (!originalTodo) return

    const updatedTodos = todoList.map((t) => (t.id === id ? { ...t, isCompleted: true } : t))
    setTodoList(updatedTodos)
    setIsSaving(true)

    const payload = { records: [{ id, fields: { title: originalTodo.title, isCompleted: true } }] }
    const options = { method: "PATCH", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify(payload) }

    try {
      const resp = await fetch(encodeUrl(), options)
      if (!resp.ok) throw new Error(resp.statusText || "Failed to complete todo")
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting todo...`)
      const revertedTodos = todoList.map((t) => (t.id === id ? originalTodo : t))
      setTodoList(revertedTodos)
    } finally {
      setIsSaving(false)
    }
  }

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((t) => t.id === editedTodo.id)
    if (!originalTodo) return
    setIsSaving(true)

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: { title: editedTodo.title, isCompleted: editedTodo.isCompleted ?? false },
        },
      ],
    }
    const options = { method: "PATCH", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify(payload) }

    try {
      const resp = await fetch(encodeUrl(), options)
      if (!resp.ok) throw new Error(resp.statusText || "Failed to update todo")
      const { records } = await resp.json()
      const updatedTodo = { id: records[0].id, ...records[0].fields }
      if (!records[0].fields.isCompleted) updatedTodo.isCompleted = false
      setTodoList(todoList.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)))
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting todo...`)
      setTodoList(todoList.map((t) => (t.id === editedTodo.id ? originalTodo : t)))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={isLoading} />

      <hr />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  )
}

export default App


