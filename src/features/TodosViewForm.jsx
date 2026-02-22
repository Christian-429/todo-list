import { useState, useEffect } from "react";
import styled from "styled-components"

const StyledForm = styled.form`
  padding: 1.5rem;
  `;

const StyledLabel = styled.label`
  padding-right: 0.4rem;
  `;
const StyledDiv = styled.div`
padding-bottom: 0.7rem;
`;

const StyledInput = styled.input`
    padding: .2rem;
  `;

function TodosViewForm({ sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString }) {

  const preventRefresh = (e) => e.preventDefault();
  const [localQueryString, setLocalQueryString] = useState(queryString)

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString)
    }, 500);

    return () => clearTimeout(debounce)
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledDiv>
        <StyledLabel htmlFor="searchTodos">Search todos:</StyledLabel>
        <StyledInput
          type="text"
          id="searchTodos"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setLocalQueryString("")}>
          Clear
        </button>
      </StyledDiv>

      <div>
        <StyledLabel htmlFor="sortField">Sort by:</StyledLabel>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <StyledLabel htmlFor="sortDirection">Direction:</StyledLabel>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
