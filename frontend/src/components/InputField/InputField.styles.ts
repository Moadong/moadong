import styled from "styled-components";

export const InputContainer = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;


export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  flex: 1;
  height: 45px;
  padding: 12px 80px 12px 18px;
  border: 1px solid #C5C5C5;
  border-radius: 6px;
  outline: none;
    font-size: 1.125rem;
    letter-spacing: 0;
  color: rgba(0, 0, 0, 0.5);
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
  }
  
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover img {
    opacity: 0.7;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: gray;
`;

export const CharCount = styled.span`
  position: absolute;
  color : #C5C5C5;
  transform: translateY(-50%);
  top: 50%;
  right: 44px;
  font-size: 12px;
  letter-spacing: -0.96px;
`;


