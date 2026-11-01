import type { Meta, StoryObj } from '@storybook/react';
import { PEACE_TYPE_IDS, PEACE_TYPES } from '../../data/peaceTypes';
import ResultCard from './ResultCard';

const meta = {
  title: 'Pages/PeacePage/Components/ResultCard',
  component: ResultCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'UN 평화축제 결과 카드. cardImages.ts에 이미지가 없는 유형은 분과 단색으로 그린다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Carer: Story = { args: { type: PEACE_TYPES.carer } };
export const Embracer: Story = { args: { type: PEACE_TYPES.embracer } };
export const Daily: Story = { args: { type: PEACE_TYPES.daily } };
export const Explorer: Story = { args: { type: PEACE_TYPES.explorer } };
export const Energizer: Story = { args: { type: PEACE_TYPES.energizer } };
export const Expresser: Story = { args: { type: PEACE_TYPES.expresser } };

export const AllTypes: Story = {
  args: { type: PEACE_TYPES.carer },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 240px)',
        gap: 16,
      }}
    >
      {PEACE_TYPE_IDS.map((id) => (
        <ResultCard key={id} type={PEACE_TYPES[id]} />
      ))}
    </div>
  ),
};
