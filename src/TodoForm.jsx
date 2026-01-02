import {useState, useRef} from "react";

function TodoForm({onAddTodo}) {
    const [workingTodoTitle, setWorkingTodo] = useState("");
    const todoTitleInput = useRef("");
    function handleAddTodo(event) {
        event.preventDefault();

        onAddTodo(workingTodoTitle);
        setWorkingTodo("");
        todoTitleInput.current.focus();
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input 
            id="todoTitle"
            name="title"
            type="text"
            ref={todoTitleInput}
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodo(event.target.value)}
            />
            <button disabled={workingTodoTitle === ""}> Add Todo</button>
        </form>
    )
}

export default TodoForm;