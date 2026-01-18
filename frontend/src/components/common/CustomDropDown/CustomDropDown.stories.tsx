import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { CustomDropDown } from './CustomDropDown';

const meta = {
  title: 'Components/Common/CustomDropDown',
  component: CustomDropDown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: '드롭다운 메뉴의 열림/닫힘 상태입니다.',
    },
    selected: {
      control: 'text',
      description: '현재 선택된 값입니다.',
    },
    onToggle: {
      action: 'toggled',
      description: '드롭다운 토글 시 호출되는 함수입니다.',
    },
    onSelect: {
      action: 'selected',
      description: '아이템 선택 시 호출되는 함수입니다.',
    },
    options: {
      control: 'object',
      description: '드롭다운 옵션 목록입니다 (Context 주입용).',
    },
  },
} satisfies Meta<typeof CustomDropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

const StyledTrigger = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  min-width: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OPTIONS = [
  { label: '옵션 1', value: 'option1' },
  { label: '옵션 2', value: 'option2' },
  { label: '옵션 3', value: 'option3' },
];

export const Default: Story = {
  args: {
    open: false,
    selected: 'option1',
    options: OPTIONS,
    onToggle: () => {},
    onSelect: () => {},
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.open);
    const [selected, setSelected] = useState(args.selected);

    const handleSelect = (value: string) => {
      setSelected(value);
      args.onSelect(value);
    };

    const onToggleWrapper = (currentOpenState: boolean) => {
      setIsOpen(!currentOpenState);
      args.onToggle(!currentOpenState);
    };

    const selectedLabel =
      args.options.find((opt) => opt.value === selected)?.label || '선택하세요';

    return (
      <CustomDropDown
        {...args}
        options={args.options as readonly { label: string; value: string }[]}
        open={isOpen}
        onToggle={onToggleWrapper}
        selected={selected as string}
        onSelect={handleSelect}
      >
        <CustomDropDown.Trigger>
          <StyledTrigger>
            {selectedLabel}
            <span>▼</span>
          </StyledTrigger>
        </CustomDropDown.Trigger>
        <CustomDropDown.Menu width='150px'>
          {args.options.map((option) => (
            <CustomDropDown.Item key={option.value} value={option.value}>
              {option.label}
            </CustomDropDown.Item>
          ))}
        </CustomDropDown.Menu>
      </CustomDropDown>
    );
  },
};
