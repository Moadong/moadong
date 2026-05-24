import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import mixpanel from 'mixpanel-browser';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { ThemeProvider } from 'styled-components';
import { handlers } from '../src/mocks/handlers';
import GlobalStyles from '../src/styles/Global.styles';
import { theme } from '../src/styles/theme';

initialize({
  onUnhandledRequest: 'bypass',
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const preview: Preview = {
  loaders: [mswLoader],
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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Story />
          </ThemeProvider>
        </QueryClientProvider>
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
    msw: {
      handlers,
    },
  },
};

export default preview;
