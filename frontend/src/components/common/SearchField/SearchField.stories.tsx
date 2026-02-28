import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchField from './SearchField';

const meta = {
  title: 'Components/Common/SearchField',
  component: SearchField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '검색어 입력값입니다.',
    },
    onChange: {
      action: 'changed',
      description: '입력값이 변경될 때 호출되는 함수입니다.',
    },
    onSubmit: {
      action: 'submitted',
      description: '검색 제출 시 호출되는 함수입니다.',
    },
    placeholder: {
      control: 'text',
      description: '입력창의 플레이스홀더 텍스트입니다.',
    },
    ariaLabel: {
      control: 'text',
      description: '접근성을 위한 aria-label 속성입니다.',
    },
    autoBlur: {
      control: 'boolean',
      description: '제출 후 자동으로 포커스를 해제할지 여부입니다.',
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 검색창 스토리
export const Default: Story = {
  args: {
    value: '',
    placeholder: '동아리 이름을 입력하세요',
    autoBlur: true,
    onChange: () => {},
    onSubmit: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <SearchField
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};

// 값이 미리 채워진 상태
export const WithValue: Story = {
  args: {
    value: '밴드 동아리',
    placeholder: '검색어를 입력하세요',
    autoBlur: true,
    onChange: () => {},
    onSubmit: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <SearchField
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};

// 커스텀 플레이스홀더
export const CustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '원하는 태그를 검색해보세요 (#음악, #운동)',
    autoBlur: true,
    onChange: () => {},
    onSubmit: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <SearchField
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};
