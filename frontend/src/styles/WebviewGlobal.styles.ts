import { createGlobalStyle } from 'styled-components';
import { colors } from '@/styles/theme/colors';

const WebviewGlobalStyles = createGlobalStyle`
  html {
    overflow-x: hidden;
    background-color: ${colors.base.white};
  }
  body {
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    cursor: default;
  }
  button, [role='button'], img {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
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
