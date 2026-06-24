import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import useAutoGrow from '@/hooks/useAutoGrow';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import InfoSection from './InfoSection';

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  overflow: hidden;
  ${setTypography(typography.paragraph.p6)}
  line-height: 160%;
  color: ${colors.base.black};
  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

interface MobileTextareaProps {
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (value: string) => void;
}

const MobileTextarea = ({
  value,
  placeholder,
  maxLength,
  onChange,
}: MobileTextareaProps) => {
  const ref = useAutoGrow(value);

  return (
    <StyledTextarea
      ref={ref}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        if (maxLength !== undefined && e.target.value.length > maxLength)
          return;
        onChange(e.target.value);
      }}
    />
  );
};

const meta = {
  title: 'Pages/AdminPage/components/InfoSection',
  component: InfoSection,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    label: '동아리를 소개할게요',
    maxLength: 200,
  },
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <InfoSection {...args} currentLength={value.length}>
        <MobileTextarea
          value={value}
          placeholder='동아리 소개 문구를 입력해주세요'
          maxLength={args.maxLength}
          onChange={setValue}
        />
      </InfoSection>
    );
  },
};

export const Filled: Story = {
  args: {
    label: '동아리를 소개할게요',
    maxLength: 200,
  },
  render: (args) => {
    const [value, setValue] = useState(
      "부경대학교 중앙 '스트릿 댄스 동아리 UCDC'는 (부경대•부산대•경성대•동의대) 부산 내 4개 대학 연합 댄스 동아리 입니다. ♥ Kpop 댄스와 다양한 스트릿 댄스를 전문으로 다루며, 열정 있는 1, 2학년 학생들을 위한 공간입니다.",
    );
    return (
      <InfoSection {...args} currentLength={value.length}>
        <MobileTextarea
          value={value}
          placeholder='동아리 소개 문구를 입력해주세요'
          maxLength={args.maxLength}
          onChange={setValue}
        />
      </InfoSection>
    );
  },
};

export const NoCounter: Story = {
  args: {
    label: '이런 상을 받았어요',
    children: <span style={{ color: colors.gray[500] }}>없음</span>,
  },
};
