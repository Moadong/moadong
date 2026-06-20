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
    onNavigate: () => {},
    children: (
      <>
        <ClubTag type='자유'>태그임</ClubTag>
        <ClubTag type='자유'>태그2</ClubTag>
      </>
    ),
  },
};

export const WithCount: Story = {
  args: {
    label: '링크 추가',
    onNavigate: () => {},
    children: <Styled.ContentText>3</Styled.ContentText>,
  },
};

export const Empty: Story = {
  args: {
    label: '자유태그 (5자이내)',
    onNavigate: () => {},
    children: <Styled.EmptyText>없음</Styled.EmptyText>,
  },
};
