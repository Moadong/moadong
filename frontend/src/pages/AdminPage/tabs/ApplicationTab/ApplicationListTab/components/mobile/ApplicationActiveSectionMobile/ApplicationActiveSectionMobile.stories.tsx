import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import { asApplicationFormId } from '@/types/branded';
import ApplicationActiveSectionMobile from './ApplicationActiveSectionMobile';

const makeForm = (id: string, title: string): ApplicationFormItem => ({
  id: asApplicationFormId(id),
  title,
  editedAt: '2025-07-01T12:46:00.000Z',
  status: 'ACTIVE' as ApplicationFormStatus,
});

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicationTab/ApplicationListTab/components/mobile/ApplicationActiveSectionMobile',
  component: ApplicationActiveSectionMobile,
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
    activeForms: [],
    openMenuId: null,
    menuRef: { current: null },
    onToggleStatus: () => {},
    onEdit: () => {},
    onMenuToggle: () => {},
    onDelete: () => {},
    onDuplicate: () => {},
  },
  render: (args) => {
    const [forms, setForms] = useState(args.activeForms);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setForms(args.activeForms);
    }, [args.activeForms]);

    const handleMenuToggle = (e: MouseEvent, id: string, prefix: string) => {
      e.stopPropagation();
      const key = `${prefix}-${id}`;
      setOpenMenuId((prev) => (prev === key ? null : key));
    };

    return (
      <ApplicationActiveSectionMobile
        activeForms={forms}
        openMenuId={openMenuId}
        menuRef={menuRef}
        onToggleStatus={(id) => {
          setForms((prev) => prev.filter((f) => f.id !== id));
          setOpenMenuId(null);
        }}
        onEdit={(id) => {
          console.log('edit', id);
          setOpenMenuId(null);
        }}
        onMenuToggle={handleMenuToggle}
        onDelete={(id) => {
          setForms((prev) => prev.filter((f) => f.id !== id));
          setOpenMenuId(null);
        }}
        onDuplicate={(id) => {
          console.log('duplicate', id);
          setOpenMenuId(null);
        }}
      />
    );
  },
} satisfies Meta<typeof ApplicationActiveSectionMobile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 활성화된 지원서 없음 */
export const Empty: Story = {
  args: { activeForms: [] },
};

/** 활성화 1개 */
export const SingleActive: Story = {
  args: { activeForms: [makeForm('form-1', 'OO동아리 8기 신입 지원서')] },
};

/** 활성화 여러 개 — 비활성화/삭제 클릭 시 목록에서 제거됨 */
export const MultipleActive: Story = {
  args: {
    activeForms: [
      makeForm('form-1', 'OO동아리 8기 신입 지원서'),
      makeForm('form-2', 'OO동아리 9기 신입 지원서'),
      makeForm('form-3', 'OO동아리 10기 편입 지원서'),
    ],
  },
};
