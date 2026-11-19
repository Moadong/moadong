import type { Meta, StoryObj } from '@storybook/react';
import FeedbackImageGrid from './FeedbackImageGrid';

const SRCS = ['/og_image.png', '/og_image.png', '/og_image.png'];

const meta: Meta<typeof FeedbackImageGrid> = {
  title: 'Feedback/FeedbackImageGrid',
  component: FeedbackImageGrid,
  args: { srcs: SRCS },
  // 시안 기준 화면 폭(375px)에서 좌우 여백을 뺀 너비라 칸이 107px로 그려진다
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeedbackImageGrid>;

/** 보낸 편지 상세. 삭제할 수 없다 */
export const ReadOnly: Story = {};

/** 편지 작성 중 첨부한 사진 */
export const Removable: Story = {
  args: { onRemove: () => {} },
};

/** 전송을 눌러 올리는 중. 첫 장은 이미 올라갔다 */
export const Uploading: Story = {
  args: {
    statuses: [undefined, 'uploading', 'uploading'],
    onRemove: () => {},
    onRetry: () => {},
    disabled: true,
  },
};

/** 한 장이 실패해 재전송을 기다린다. 실패한 사진도 지울 수 있다 */
export const Failed: Story = {
  args: {
    statuses: [undefined, 'failed', undefined],
    onRemove: () => {},
    onRetry: () => {},
  },
};
