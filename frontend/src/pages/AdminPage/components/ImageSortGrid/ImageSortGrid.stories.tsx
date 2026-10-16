import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageSortGrid } from './ImageSortGrid';
import type { ImageItem } from './types';

const img = (seed: string): ImageItem => ({
  type: 'uploaded',
  url: `https://picsum.photos/seed/${seed}/246/320`,
});

const local = (
  seed: string,
  status: 'pending' | 'uploading' | 'failed',
): ImageItem => ({
  type: 'local',
  file: new File([], `${seed}.jpg`),
  previewUrl: `https://picsum.photos/seed/${seed}/246/320`,
  status,
});

const Wrapper = ({
  items,
  isLoading = false,
  dragIndex = null,
  dropPosition = null,
  columns = 3,
}: {
  items: ImageItem[];
  isLoading?: boolean;
  dragIndex?: number | null;
  dropPosition?: Parameters<typeof ImageSortGrid>[0]['dropPosition'];
  columns?: number;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ width: 335 }}>
      <ImageSortGrid
        items={items}
        gridRef={gridRef}
        dragIndex={dragIndex}
        dropPosition={dropPosition}
        isLoading={isLoading}
        columns={columns}
        onMouseDown={() => {}}
        onDelete={() => {}}
        onRetry={() => {}}
      />
    </div>
  );
};

const meta = {
  title: 'Pages/AdminPage/components/ImageSortGrid',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllUploaded: Story = {
  render: () => <Wrapper items={['a', 'b', 'c', 'd', 'e', 'f'].map(img)} />,
};

export const WithPending: Story = {
  render: () => (
    <Wrapper
      items={[
        img('a'),
        img('b'),
        local('p1', 'pending'),
        local('p2', 'pending'),
        img('e'),
      ]}
    />
  ),
};

export const Uploading: Story = {
  render: () => (
    <Wrapper
      isLoading
      items={[
        img('a'),
        img('b'),
        local('u1', 'uploading'),
        local('u2', 'uploading'),
        local('u3', 'uploading'),
      ]}
    />
  ),
};

export const WithFailure: Story = {
  render: () => (
    <Wrapper
      items={[
        img('a'),
        local('f1', 'failed'),
        img('c'),
        local('f2', 'failed'),
        img('e'),
      ]}
    />
  ),
};

export const MixedStatuses: Story = {
  render: () => (
    <Wrapper
      items={[
        img('a'),
        local('p', 'pending'),
        local('u', 'uploading'),
        local('f', 'failed'),
        img('e'),
        img('f'),
      ]}
    />
  ),
};

export const Dragging: Story = {
  render: () => (
    <Wrapper
      items={['a', 'b', 'c', 'd', 'e'].map(img)}
      dragIndex={1}
      dropPosition={{ index: 3, side: 'after' }}
    />
  ),
};
