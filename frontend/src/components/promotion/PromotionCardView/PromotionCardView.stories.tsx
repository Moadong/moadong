import type { Meta, StoryObj } from '@storybook/react';
import { PromotionArticle } from '@/types/promotion';
import PromotionCardView from './PromotionCardView';

const base: PromotionArticle = {
  id: 'a1',
  clubId: 'club-1',
  clubName: '극예술연구회',
  title: 'EXODUS : 대탈출',
  location: '부경대학교 나비센터 2층 소극장',
  latitude: 35.132367,
  longitude: 129.106974,
  eventStartDate: '2026-11-29T04:00:00+09:00',
  eventEndDate: '2026-11-30T02:00:00+09:00',
  description: '설명',
  images: ['https://picsum.photos/seed/promotion/400/400'],
};

const meta = {
  title: 'Components/promotion/PromotionCardView',
  component: PromotionCardView,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PromotionCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 여러날_행사: Story = { args: { article: base } };

export const 하루짜리_행사: Story = {
  args: {
    article: { ...base, eventEndDate: '2026-11-29T22:00:00+09:00' },
  },
};

export const 이미지_없음: Story = {
  args: { article: { ...base, images: [] } },
};

export const 종료된_행사: Story = {
  args: {
    article: {
      ...base,
      eventStartDate: '2020-01-01T10:00:00+09:00',
      eventEndDate: '2020-01-01T12:00:00+09:00',
    },
  },
};
