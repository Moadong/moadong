import { createGlobalStyle } from 'styled-components';

const WebviewGlobalStyles = createGlobalStyle`
  body {
    overscroll-behavior: none;
    overflow-x: hidden;
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
