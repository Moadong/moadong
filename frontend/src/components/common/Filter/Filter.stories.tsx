import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import Filter from './Filter';
import * as Styled from './Filter.styles';

const setViewportWidth = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const meta = {
  title: 'Pages/MainPage/Components/Filter',
  component: Filter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '모바일 화면에서 상단 탭 형태로 표시되는 필터입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClubTab: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(375);
      return (
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export const PromotionTab: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(375);
      return (
        <MemoryRouter initialEntries={['/promotion']}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

const InteractiveNotificationFilter = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState<'club' | 'promotion'>('club');

  const handlePromotionClick = () => {
    setShowNotification(false);
    setActiveTab('promotion');
  };

  return (
    <Styled.FilterListContainer>
      <Styled.FilterButton
        $isActive={activeTab === 'club'}
        onClick={() => setActiveTab('club')}
      >
        동아리
      </Styled.FilterButton>
      <Styled.FilterButtonWrapper>
        <Styled.FilterButton
          $isActive={activeTab === 'promotion'}
          onClick={handlePromotionClick}
        >
          홍보
        </Styled.FilterButton>
        <Styled.NotificationDot $isVisible={showNotification} />
      </Styled.FilterButtonWrapper>
    </Styled.FilterListContainer>
  );
};

export const WithNotificationDot: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(375);
      return (
        <MemoryRouter initialEntries={['/']}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
  render: () => <InteractiveNotificationFilter />,
};
