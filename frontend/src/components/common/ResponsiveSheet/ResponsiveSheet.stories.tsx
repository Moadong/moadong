import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@/styles/theme/colors';
import Button from '../Button/Button';
import ResponsiveSheet from './ResponsiveSheet';

const meta = {
  title: 'Components/Common/ResponsiveSheet',
  component: ResponsiveSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '시트의 열림/닫힘 상태입니다.',
    },
    onClose: {
      action: 'closed',
      description: '닫기(배경 클릭/ESC) 시 호출됩니다.',
    },
    children: {
      control: false,
      description: '시트 내부에 렌더링될 컨텐츠입니다.',
    },
    sheetBackground: {
      control: 'color',
      description: '시트의 배경색입니다. 기본값은 흰색입니다.',
    },
    stacked: {
      control: 'boolean',
      description:
        '위에 다른 시트를 겹쳐 띄울 때 뒤에서 보이도록 들어올립니다. 바텀시트일 때만 적용됩니다.',
    },
  },
} satisfies Meta<typeof ResponsiveSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// 화면 너비가 700px 이하면 바텀시트, 그보다 넓으면 가운데 모달로 열린다.
// 툴바의 뷰포트를 700px 이하로 바꾸면 바텀시트 모양을 확인할 수 있다.
// 닫힌 채로 시작한다. 처음부터 열면 docs 페이지 전체를 오버레이가 덮는다.
const SheetTemplate = (args: Story['args']) => {
  const [isOpen, setIsOpen] = useState(args?.isOpen ?? false);

  const handleClose = () => {
    setIsOpen(false);
    args?.onClose?.();
  };

  return (
    <div style={{ height: '100dvh', padding: 20 }}>
      <Button onClick={() => setIsOpen(true)}>시트 열기</Button>
      <ResponsiveSheet
        isOpen={isOpen}
        onClose={handleClose}
        sheetBackground={args?.sheetBackground}
        stacked={args?.stacked}
      >
        <div style={{ padding: '8px 0 40px' }}>
          <h4 style={{ margin: '0 0 12px' }}>시트 콘텐츠</h4>
          <p style={{ margin: 0, color: colors.gray[700] }}>
            작은 화면에서는 하단 시트로, 큰 화면에서는 모달로 열립니다.
          </p>
        </div>
      </ResponsiveSheet>
    </div>
  );
};

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
  render: (args) => <SheetTemplate {...args} />,
};

// 배경색을 바꾼 경우. 바텀시트·모달 카드 모두에 적용된다.
export const CustomBackground: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
    sheetBackground: colors.gray[100],
  },
  render: (args) => <SheetTemplate {...args} />,
};
