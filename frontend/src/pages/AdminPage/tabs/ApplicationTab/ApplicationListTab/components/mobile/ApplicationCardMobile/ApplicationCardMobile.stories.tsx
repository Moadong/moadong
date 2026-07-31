import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationFormStatus } from '@/types/application';
import { asApplicationFormId } from '@/types/branded';
import ApplicationCardMobile from './ApplicationCardMobile';

const mockApplication = {
  id: asApplicationFormId('form-1'),
  title: 'OO동아리 8기 신입 지원서',
  editedAt: '2025-07-01T12:46:00.000Z',
  status: 'ACTIVE' as ApplicationFormStatus,
};

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicationTab/ApplicationListTab/components/mobile/ApplicationCardMobile',
  component: ApplicationCardMobile,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    menuRef: { table: { disable: true } },
    openMenuId: { table: { disable: true } },
  },
  args: {
    application: mockApplication,
    isActive: true,
    uniqueKeyPrefix: 'story',
    openMenuId: null,
    menuRef: { current: null },
    onToggleStatus: () => {},
    onEdit: () => {},
    onMenuToggle: () => {},
    onDelete: () => {},
  },
  render: (args) => {
    const [isActive, setIsActive] = useState(args.isActive);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setIsActive(args.isActive);
    }, [args.isActive]);

    const handleMenuToggle = (e: MouseEvent, id: string, prefix: string) => {
      e.stopPropagation();
      const key = `${prefix}-${id}`;
      setOpenMenuId((prev) => (prev === key ? null : key));
    };

    return (
      <ApplicationCardMobile
        {...args}
        isActive={isActive}
        openMenuId={openMenuId}
        menuRef={menuRef}
        onToggleStatus={() => {
          setIsActive((prev) => !prev);
          setOpenMenuId(null);
        }}
        onEdit={() => {
          console.log('edit');
          setOpenMenuId(null);
        }}
        onMenuToggle={handleMenuToggle}
        onDelete={() => {
          console.log('delete');
          setOpenMenuId(null);
        }}
      />
    );
  },
} satisfies Meta<typeof ApplicationCardMobile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { isActive: true },
};

export const Inactive: Story = {
  args: {
    application: { ...mockApplication, status: 'INACTIVE' },
    isActive: false,
  },
};

export const LongTitle: Story = {
  args: {
    application: {
      ...mockApplication,
      title: '제목이 50자에 가까운 긴 지원서 제목의 예시입니다아아아아아아아',
    },
    isActive: true,
  },
};
