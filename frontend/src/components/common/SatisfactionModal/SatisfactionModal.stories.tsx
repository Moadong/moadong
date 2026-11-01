import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from 'storybook/test';
import { SATISFACTION_ASK_THRESHOLD } from '@/constants/appReview';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import SatisfactionModal from './SatisfactionModal';

// 노출 조건(useSatisfactionSurvey)을 건드리는 저장소 키. 스토리가 끝나면 원래 값으로 되돌린다.
const SURVEY_KEYS = [
  STORAGE_KEYS.CLUB_VIEW_COUNT,
  STORAGE_KEYS.VISIT_DAY_COUNT,
  STORAGE_KEYS.LAST_VISIT_DATE,
  STORAGE_KEYS.SATISFACTION_ANSWERED,
];

const meta = {
  title: 'Components/Common/SatisfactionModal',
  component: SatisfactionModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `앱 웹뷰에서 ${SATISFACTION_ASK_THRESHOLD}일 이상 방문했거나 동아리 상세를 ${SATISFACTION_ASK_THRESHOLD}번 이상 본 사용자에게 만족도를 묻는다. 좋아요는 스토어 리뷰로, 아쉬워요는 우체통으로 보낸다.`,
      },
    },
  },
  // 앱 웹뷰에서만 뜨는 모달이라 웹뷰 모드로 연다.
  globals: { webview: 'on' },
  beforeEach: () => {
    const saved = SURVEY_KEYS.map(
      (key) => [key, localStorage.getItem(key)] as const,
    );
    SURVEY_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(
      STORAGE_KEYS.CLUB_VIEW_COUNT,
      String(SATISFACTION_ASK_THRESHOLD),
    );

    return () => {
      saved.forEach(([key, value]) =>
        value === null
          ? localStorage.removeItem(key)
          : localStorage.setItem(key, value),
      );
    };
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SatisfactionModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 첫_질문: Story = {};

// 좋아요를 누르면 스토어 리뷰를 권한다.
export const 리뷰_요청: Story = {
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await screen.findByRole('button', { name: '좋아요!' }),
    );
    await screen.findByText('앱이 마음에 드시나요?');
  },
};

// 아쉬워요를 누르면 스토어 대신 우체통으로 보낸다.
export const 우체통_안내: Story = {
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await screen.findByRole('button', { name: '아쉬워요' }),
    );
    await screen.findByText('함께 개선해요');
  },
};
