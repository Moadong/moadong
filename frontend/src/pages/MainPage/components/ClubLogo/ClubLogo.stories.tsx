import type { Meta, StoryObj } from '@storybook/react';
import default_profile_image from '@/assets/images/logos/default_profile_image.svg';
import ClubLogo from './ClubLogo';

const meta = {
  title: 'Pages/MainPage/Components/ClubLogo',
  component: ClubLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '동아리 로고 이미지를 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    $variant: {
      control: 'radio',
      options: ['main', 'detail'],
      description: '로고 크기/라운드 프리셋을 선택합니다.',
      table: {
        type: { summary: "'main' | 'detail'" },
      },
    },
    $imageSrc: {
      control: 'text',
      description: '로고 이미지 URL입니다.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof ClubLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    $imageSrc: default_profile_image,
    $variant: 'main',
  },
};

export const Detail: Story = {
  args: {
    $imageSrc: default_profile_image,
    $variant: 'detail',
  },
};
