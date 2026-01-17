import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CustomTextArea from './CustomTextArea';

const meta = {
  title: 'Components/Common/CustomTextArea',
  component: CustomTextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '텍스트 영역의 값입니다.',
    },
    onChange: {
      action: 'changed',
      description: '값이 변경될 때 호출되는 함수입니다.',
    },
    placeholder: {
      control: 'text',
      description: '텍스트 영역의 플레이스홀더입니다.',
    },
    label: {
      control: 'text',
      description: '텍스트 영역 상단에 표시되는 라벨입니다.',
    },
    width: {
      control: 'text',
      description: '텍스트 영역의 너비입니다.',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부입니다.',
    },
    isError: {
      control: 'boolean',
      description: '에러 상태 여부입니다.',
    },
    helperText: {
      control: 'text',
      description: '하단에 표시되는 도움말 텍스트입니다 (에러 시 표시).',
    },
    showMaxChar: {
      control: 'boolean',
      description: '최대 글자수 표시 여부입니다.',
    },
    maxLength: {
      control: 'number',
      description: '최대 글자수 제한입니다.',
    },
  },
} satisfies Meta<typeof CustomTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '내용을 입력하세요',
    width: '300px',
    value: '',
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value || '');
    return (
      <CustomTextArea
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
      />
    );
  },
};

export const WithLabel: Story = {
  args: {
    label: '자기소개',
    placeholder: '자기소개를 입력하세요',
    width: '300px',
    value: '',
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value || '');
    return (
      <CustomTextArea
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
      />
    );
  },
};

export const ErrorState: Story = {
  args: {
    label: '지원동기',
    value: '너무 짧습니다.',
    isError: true,
    helperText: '10자 이상 입력해주세요.',
    width: '300px',
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value || '');
    return (
      <CustomTextArea
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
      />
    );
  },
};

export const WithMaxLength: Story = {
  args: {
    label: '문의 내용',
    placeholder: '100자 이내로 입력해주세요',
    maxLength: 100,
    showMaxChar: true,
    width: '300px',
    value: '',
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value || '');
    return (
      <CustomTextArea
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: '피드백',
    value: '이미 제출된 피드백입니다.',
    disabled: true,
    width: '300px',
    onChange: () => {},
  },
};
