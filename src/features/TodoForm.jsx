import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 0.2rem;
  font-style: normal;
  font-color: rgb(0,0,0);
  &:disabled {
    font-style: italic;
    font-weight: bolder;
  }
`;

const StyledForm = styled.form`
  padding: 0.7rem;
  `;

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
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                labelText="Todo"
                ref={todoTitleInput}
                value={workingTodo}
                onChange={(event) => setWorkingTodo(event.target.value)}
            />

            <StyledButton disabled={workingTodo.trim() === ''}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </StyledButton>

        </StyledForm>
    );
}

export default TodoForm;
