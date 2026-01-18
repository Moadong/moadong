import { useEffect } from 'react';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        if (!document.getElementById('modal-root')) {
          const modalRoot = document.createElement('div');
          modalRoot.id = 'modal-root';
          document.body.appendChild(modalRoot);
        }
      }, []);

      return Story();
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
