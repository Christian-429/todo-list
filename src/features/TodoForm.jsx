import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo }) {
    const [workingTodo, setWorkingTodo] = useState("");
    const todoTitleInput = useRef("");

    function handleAddTodo(event) {
        event.preventDefault();

        onAddTodo(workingTodo);
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

            <button disabled={workingTodo === ""}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
