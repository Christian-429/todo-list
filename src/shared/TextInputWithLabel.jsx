import styled from "styled-components";

const StyledInput = styled.input`
  padding: 0.2rem;
  `;

function TextInputWithLabel( {elementId, label, onChange, ref, value,}) {
    return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel