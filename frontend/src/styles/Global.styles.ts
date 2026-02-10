import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    overscroll-behavior: none;
  }
  textarea, button, input, select {
    font-family: 'Pretendard', sans-serif;
  }
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
    color: #121212;
    letter-spacing: -0.02em;
  }
`;

export default GlobalStyles;
