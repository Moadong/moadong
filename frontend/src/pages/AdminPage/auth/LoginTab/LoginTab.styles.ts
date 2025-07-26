import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
`;

export const LoginBox = styled.div`
  width: 610px;
  height: 640px;
  padding: 92px;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.4);
  text-align: center;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Logo = styled.img`
  width: 340px;
  margin-bottom: 85px;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: 'Krona One', sans-serif;
  line-height: 42px;
  letter-spacing: -0.04em;
  align-self: flex-start;
`;

export const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const InputFieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export const ForgotLinks = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  color: rgba(0, 0, 0, 0.3);

  a {
    color: #666;
    text-decoration: none;
    font-size: 14px;
  }

  span {
    color: #ccc;
  }
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;
