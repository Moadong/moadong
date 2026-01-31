import { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import mixpanel from 'mixpanel-browser';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../src/styles/Global.styles';
import { theme } from '../src/styles/theme';

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        try {
          mixpanel.init('storybook', { debug: false, ignore_dnt: true });
          mixpanel.disable();
        } catch (error) {
          console.warn('Failed to initialize mixpanel for Storybook:', error);
        }
        if (!document.getElementById('modal-root')) {
          const modalRoot = document.createElement('div');
          modalRoot.id = 'modal-root';
          document.body.appendChild(modalRoot);
        }
      }, []);

      return (
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
