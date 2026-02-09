import type { Meta, StoryObj } from '@storybook/react';
import Popup, {
  AB_TEST_KEY,
  POPUP_SESSION_KEY,
  POPUP_STORAGE_KEY,
} from './Popup';

const setMobilePopupState = () => {
  window.innerWidth = 375;
  window.dispatchEvent(new Event('resize'));
  localStorage.setItem(AB_TEST_KEY, 'show_popup');
  sessionStorage.removeItem(POPUP_SESSION_KEY);
  localStorage.removeItem(POPUP_STORAGE_KEY);
};

const meta = {
  title: 'Pages/MainPage/Components/Popup',
  component: Popup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '모바일에서 노출되는 앱 다운로드 팝업입니다.',
      },
    },
  },
  decorators: [
    (Story) => {
      setMobilePopupState();
      return <Story />;
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
