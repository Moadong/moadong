import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FeedItem } from '../../types';
import { FeedImageGrid } from './FeedImageGrid';

const img = (seed: string): FeedItem => ({
  type: 'uploaded',
  url: `https://picsum.photos/seed/${seed}/246/320`,
});

const local = (
  seed: string,
  status: 'pending' | 'uploading' | 'failed',
): FeedItem => ({
  type: 'local',
  file: new File([], `${seed}.jpg`),
  previewUrl: `https://picsum.photos/seed/${seed}/246/320`,
  status,
});

const Wrapper = ({
  feedItems,
  isLoading = false,
  dragIndex = null,
  dropPosition = null,
  columns = 3,
}: {
  feedItems: FeedItem[];
  isLoading?: boolean;
  dragIndex?: number | null;
  dropPosition?: Parameters<typeof FeedImageGrid>[0]['dropPosition'];
  columns?: number;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ width: 335 }}>
      <FeedImageGrid
        feedItems={feedItems}
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
  title: 'Pages/AdminPage/tabs/PhotoEditTab/components/FeedImageGrid',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllUploaded: Story = {
  render: () => (
    <Wrapper feedItems={['a', 'b', 'c', 'd', 'e', 'f'].map(img)} />
  ),
};

export const WithPending: Story = {
  render: () => (
    <Wrapper
      feedItems={[
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
      feedItems={[
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
      feedItems={[
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
      feedItems={[
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
      feedItems={['a', 'b', 'c', 'd', 'e'].map(img)}
      dragIndex={1}
      dropPosition={{ index: 3, side: 'after' }}
    />
  ),
};
