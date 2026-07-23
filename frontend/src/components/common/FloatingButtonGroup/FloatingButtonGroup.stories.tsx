import type { Meta, StoryObj } from '@storybook/react';
import ScrollToTopIcon from '@/assets/images/icons/scroll_to_top_icon.svg?react';
import ShareFloatingIcon from '@/assets/images/icons/share_floating_icon.svg?react';
import * as Styled from './FloatingButtonGroup.styles';

// FloatingButtonGroup은 내부 스크롤 훅으로 가시성이 제어되므로
// Storybook에서는 스타일 컴포넌트를 직접 사용해 시각적 상태를 표현합니다.
const FloatingButtonGroupDemo = ({
  showScrollToTop,
  showShare,
}: {
  showScrollToTop: boolean;
  showShare: boolean;
}) => (
  <Styled.GroupContainer>
    <Styled.FloatingButton
      type='button'
      $isVisible={showScrollToTop}
      onClick={() => {}}
      aria-label='위로 이동하기'
    >
      <ScrollToTopIcon aria-hidden />
    </Styled.FloatingButton>
    <Styled.FloatingButton
      type='button'
      $isVisible={showShare}
      onClick={() => {}}
      aria-label='현재 페이지 공유하기'
    >
      <ShareFloatingIcon aria-hidden />
    </Styled.FloatingButton>
  </Styled.GroupContainer>
);

const meta = {
  title: 'Components/Common/FloatingButtonGroup',
  component: FloatingButtonGroupDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showScrollToTop: {
      control: 'boolean',
      description: '위로 이동 버튼 표시 여부 (스크롤을 내렸을 때 표시됩니다.)',
    },
    showShare: {
      control: 'boolean',
      description: '공유 버튼 표시 여부 (위로 스크롤할 때 표시됩니다.)',
    },
  },
} satisfies Meta<typeof FloatingButtonGroupDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothVisible: Story = {
  args: {
    showScrollToTop: true,
    showShare: true,
  },
};

export const ScrollToTopOnly: Story = {
  args: {
    showScrollToTop: true,
    showShare: false,
  },
};

export const BothHidden: Story = {
  args: {
    showScrollToTop: false,
    showShare: false,
  },
};
