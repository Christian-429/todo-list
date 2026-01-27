import './App.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import { useState, useEffect } from 'react'

function App() {
  const [todoList, setTodoList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false);


  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(url, options);

        if (!resp.ok) {
          throw new Error(resp.statusText || "Failed to fetch todos");
        }


        const data = await resp.json();

        const todos = data.records.map((record) => {
          return {
            id: record.id,
            title: record.fields.title || "",
            isCompleted: record.fields.isCompleted || false,
          };
        });

        setTodoList(todos);

      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

const addTodo = async (newTodo) => {
  setIsSaving(true);

  const payload = {
    records: [
      {
        fields: {
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        },
      },
    ],
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const resp = await fetch(url, options);

    if (!resp.ok) {
      throw new Error(resp.statusText || "Failed to add todo");
    }
    const { records } = await resp.json();
    const savedTodo = {
      id: records[0].id,
      ...records[0].fields,
    };
    if (!records[0].fields.isCompleted) {
      savedTodo.isCompleted = false;
    }
    setTodoList([...todoList, savedTodo]);
  } catch (error) {
    console.error(error);
    setErrorMessage(error.message || "Failed to save todo");
  } finally {
    setIsSaving(false);
  }
};



  const completeTodo = async (id) => {
  const originalTodo = todoList.find((todo) => todo.id === id);
  if (!originalTodo) return;

  const updatedTodos = todoList.map((todo) =>
    todo.id === id ? { ...todo, isCompleted: true } : todo
  );
  setTodoList(updatedTodos);
  setIsSaving(true);

  const payload = {
    records: [
      {
        id: id,
        fields: {
          title: originalTodo.title,
          isCompleted: true,
        },
      },
    ],
  };

  const options = {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const resp = await fetch(url, options);
    if (!resp.ok) throw new Error(resp.statusText || "Failed to complete todo");

    const { records } = await resp.json();
    const savedTodo = {
      id: records[0].id,
      ...records[0].fields,
    };
    if (!records[0].fields.isCompleted) savedTodo.isCompleted = false;

    const syncedTodos = todoList.map((todo) =>
      todo.id === savedTodo.id ? savedTodo : todo
    );
    setTodoList(syncedTodos);
  } catch (error) {
    setErrorMessage(`${error.message}. Reverting todo...`);
    const revertedTodos = todoList.map((todo) =>
      todo.id === originalTodo.id ? originalTodo : todo
    );
    setTodoList(revertedTodos);
  } finally {
    setIsSaving(false);
  }
};


const updateTodo = async (editedTodo) => {
  const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
  if (!originalTodo) return;

  setIsSaving(true);

  const payload = {
    records: [
      {
        id: editedTodo.id,
        fields: {
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted ?? false,
        },
      },
    ],
  };

  const options = {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const resp = await fetch(url, options);
    if (!resp.ok) throw new Error(resp.statusText || "Failed to update todo");

    const { records } = await resp.json();
    const updatedTodo = {
      id: records[0].id,
      ...records[0].fields,
    };
    if (!records[0].fields.isCompleted) updatedTodo.isCompleted = false;

    const updatedTodos = todoList.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodoList(updatedTodos);
  } catch (error) {
    console.error(error);
    setErrorMessage(`${error.message}. Reverting todo...`);
    const revertedTodos = todoList.map((todo) =>
      todo.id === originalTodo.id ? originalTodo : todo
    );
    setTodoList(revertedTodos);
  } finally {
    setIsSaving(false);
  }
};



  return (
    <div>
      <h1>To Do List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
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

