import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationFormStatus } from '@/types/application';
import { asApplicationFormId } from '@/types/branded';
import ApplicationCardMobile from './ApplicationCardMobile';

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
} satisfies Meta<typeof ApplicationCardMobile>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTemplate = ({
  initialActive,
  title = 'OO동아리 8기 신입 지원서',
}: {
  initialActive: boolean;
  title?: string;
}) => {
  const [isActive, setIsActive] = useState(initialActive);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const application = {
    id: asApplicationFormId('form-1'),
    title,
    editedAt: '2025-07-01T12:46:00.000Z',
    status: (isActive ? 'ACTIVE' : 'INACTIVE') as ApplicationFormStatus,
  };

  const handleMenuToggle = (e: MouseEvent, id: string, prefix: string) => {
    e.stopPropagation();
    const key = `${prefix}-${id}`;
    setOpenMenuId((prev) => (prev === key ? null : key));
  };

  return (
    <ApplicationCardMobile
      application={application}
      isActive={isActive}
      uniqueKeyPrefix='story'
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
};

export const Active: Story = {
  render: () => <InteractiveTemplate initialActive={true} />,
};

export const Inactive: Story = {
  render: () => <InteractiveTemplate initialActive={false} />,
};

export const LongTitle: Story = {
  render: () => (
    <InteractiveTemplate
      initialActive={true}
      title='제목이 50자에 가까운 긴 지원서 제목의 예시입니다아아아아아아아'
    />
  ),
};
