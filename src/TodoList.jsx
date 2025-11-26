function TodoList() {
    const todos = [
        { id: 1, text: "Study" },
        { id: 2, text: "Eat" },
        { id: 3, text: "Sleep" }
    ];

    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>{todo.text}</li>
            ))}
        </ul>
    );
}

export default TodoList;