import styled from "styled-components";

interface ButtonProps {
    selected: boolean;
}

export const Button = styled.button<ButtonProps>`
  font-size: 0.875rem;
  padding: 5px 8px;
  border-radius: 4px;
  border: none;
  transition: all 0.1s;
  font-weight: 600;
  background-color: ${(props) => (props.selected ? "#FF5414" : "rgba(0, 0, 0, 0.05)")};
  color: ${(props) => (props.selected ? "white" : "#4B4B4B")};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.selected ? "#ea580c" : "#d1d5db")};
  }
`;

export const Container = styled.div`
  display: flex;
  gap: 12px;
`;

export const Label = styled.p`
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;
