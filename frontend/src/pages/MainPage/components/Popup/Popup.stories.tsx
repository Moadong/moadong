import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import Popup from './Popup';
import { APP_DOWNLOAD_POPUP } from './popupConfigs';

const clearPopupState = () => {
  sessionStorage.removeItem(APP_DOWNLOAD_POPUP.sessionKey);
  localStorage.removeItem(APP_DOWNLOAD_POPUP.storageKey);
};

const meta = {
  title: 'Pages/MainPage/Components/Popup',
  component: Popup,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone6',
    },
    docs: {
      description: {
        component: '모바일에서 노출되는 앱 다운로드 팝업입니다.',
      },
    },
  },
  decorators: [
    (Story) => {
      clearPopupState();
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    configs: [APP_DOWNLOAD_POPUP],
  },
};
