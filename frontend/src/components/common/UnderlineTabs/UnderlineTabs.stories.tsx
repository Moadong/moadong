import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import UnderlineTabs from './UnderlineTabs';

const SAMPLE_TABS = [
  { key: 'map', label: '부스지도' },
  { key: 'timetable', label: '동아리시간표' },
] as const;

const InteractiveTabs = ({
  centerOnMobile = false,
}: {
  centerOnMobile?: boolean;
}) => {
  const [activeKey, setActiveKey] = useState<string>('map');

  return (
    <div style={{ maxWidth: 550, margin: '0 auto', paddingTop: 24 }}>
      <UnderlineTabs
        tabs={SAMPLE_TABS.map((tab) => ({ ...tab }))}
        activeKey={activeKey}
        onTabClick={setActiveKey}
        centerOnMobile={centerOnMobile}
      />
    </div>
  );
};

const meta = {
  title: 'Components/Common/UnderlineTabs',
  component: UnderlineTabs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '하단 보더 강조형 탭 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UnderlineTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: SAMPLE_TABS.map((tab) => ({ ...tab })),
    activeKey: 'map',
    onTabClick: () => {},
    centerOnMobile: false,
  },
  render: () => <InteractiveTabs />,
};

export const CenterOnMobile: Story = {
  args: {
    tabs: SAMPLE_TABS.map((tab) => ({ ...tab })),
    activeKey: 'map',
    onTabClick: () => {},
    centerOnMobile: true,
  },
  parameters: {
    viewport: {
      options: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone6',
    },
  },
  // defaultViewport는 Chromatic 스냅샷 폭에 쓰이고, Storybook 10 화면은 globals.viewport를 읽는다.
  globals: { viewport: { value: 'iphone6', isRotated: false } },
  render: () => <InteractiveTabs centerOnMobile />,
};
