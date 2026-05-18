import { createGlobalStyle } from 'styled-components';

const WebviewGlobalStyles = createGlobalStyle`
  html {
    overflow-x: hidden;
  }
  body {
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    cursor: default;
  }
  * {
    -webkit-tap-highlight-color: transparent;
    scrollbar-width: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default WebviewGlobalStyles;
