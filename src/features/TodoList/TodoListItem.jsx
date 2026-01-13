import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    function handleUpdate(event) {
        if (!isEditing) return;

        event.preventDefault();

        onUpdateTodo({
            ...todo,
            title: workingTitle,
        });

        setIsEditing(false);
    }

    return (
        <li>
            {isEditing ? (
                <>
                    <TextInputWithLabel
                        value={workingTitle}
                        onChange={handleEdit}
                    />
                    <button
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                </>
            ) : (
                <form onSubmit={handleUpdate}>
                    <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                    <span onClick={() => setIsEditing(true)}>
                        {todo.title}
                    </span>
                </form>
            )}
        </li>
    );
}

export default TodoListItem;



