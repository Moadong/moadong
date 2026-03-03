import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import Popup, { POPUP_SESSION_KEY, POPUP_STORAGE_KEY } from './Popup';

const setMobilePopupState = () => {
  sessionStorage.removeItem(POPUP_SESSION_KEY);
  localStorage.removeItem(POPUP_STORAGE_KEY);
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
      setMobilePopupState();
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

export const Default: Story = {};
