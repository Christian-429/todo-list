import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
    const [workingTodo, setWorkingTodo] = useState("");
    const todoTitleInput = useRef("");

    function handleAddTodo(event) { 
    event.preventDefault(); 

    onAddTodo({
        title: workingTodo,
        isCompleted: false
    });

    setWorkingTodo("");
    todoTitleInput.current.focus();
}


    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                labelText="Todo"
                ref={todoTitleInput}
                value={workingTodo}
                onChange={(event) => setWorkingTodo(event.target.value)}
            />

            <button disabled={workingTodo.trim() === ''}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </button>

        </form>
    );
}

export default TodoForm;
