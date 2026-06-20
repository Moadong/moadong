import type { Meta, StoryObj } from '@storybook/react';
import ClubTag from '@/components/ClubTag/ClubTag';
import NavField from './NavField';
import * as Styled from './NavField.styles';

const meta = {
  title: 'Pages/AdminPage/Components/editFields/NavField',
  component: NavField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTags: Story = {
  args: {
    label: '자유태그 (5자이내)',
    onNavigate: () => console.log('자유태그 페이지로 이동하겠습니다.'),
    children: (
      <>
        <ClubTag type='자유'>태그임</ClubTag>
        <ClubTag type='자유'>태그2</ClubTag>
      </>
    ),
  },
};

export const WithLinkCount: Story = {
  args: {
    label: '링크 추가',
    onNavigate: () => console.log('링크 추가 페이지로 이동하겠습니다.'),
    children: <Styled.ContentText>3</Styled.ContentText>,
  },
};

export const Empty: Story = {
  args: {
    label: '자유태그 (5자이내)',
    onNavigate: () => console.log('자유태그 페이지로 이동하겠습니다.'),
    children: <Styled.EmptyText>없음</Styled.EmptyText>,
  },
};
