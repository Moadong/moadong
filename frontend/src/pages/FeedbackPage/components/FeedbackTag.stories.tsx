import type { Meta, StoryObj } from '@storybook/react';
import {
  FEEDBACK_TYPE_META,
  FEEDBACK_TYPE_ORDER,
  LETTER_CATEGORY_META,
  LETTER_CATEGORY_ORDER,
  SENT_STATUS_META,
} from '@/constants/feedback';
import FeedbackTag from './FeedbackTag';

const meta: Meta<typeof FeedbackTag> = {
  title: 'Feedback/FeedbackTag',
  component: FeedbackTag,
};

export default meta;
type Story = StoryObj<typeof FeedbackTag>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div>
);

/** 사용자가 보내는 피드백 유형 4종. 아이콘이 함께 붙는다 */
export const FeedbackTypes: Story = {
  render: () => (
    <Row>
      {FEEDBACK_TYPE_ORDER.map((type) => {
        const meta = FEEDBACK_TYPE_META[type];
        return (
          <FeedbackTag
            key={type}
            label={meta.tagLabel}
            backgroundColor={meta.backgroundColor}
            color={meta.accentColor}
            Icon={meta.Icon}
          />
        );
      })}
    </Row>
  ),
};

/** 받은 편지 분류 3종. 목록 필터와 상세 상단에 쓰인다 */
export const LetterCategories: Story = {
  render: () => (
    <Row>
      {LETTER_CATEGORY_ORDER.map((category) => {
        const meta = LETTER_CATEGORY_META[category];
        return (
          <FeedbackTag
            key={category}
            label={meta.label}
            backgroundColor={meta.backgroundColor}
            color={meta.color}
          />
        );
      })}
    </Row>
  ),
};

/** 보낸 편지 처리 상태 2종 */
export const SentStatuses: Story = {
  render: () => (
    <Row>
      {Object.values(SENT_STATUS_META).map((meta) => (
        <FeedbackTag
          key={meta.label}
          label={meta.label}
          backgroundColor={meta.backgroundColor}
          color={meta.color}
        />
      ))}
    </Row>
  ),
};
