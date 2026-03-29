import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FeedItem } from '../../PhotoEditTab';
import { FeedImageGrid } from './FeedImageGrid';

const IMAGES = [
  'https://picsum.photos/seed/a/400/500',
  'https://picsum.photos/seed/b/400/500',
  'https://picsum.photos/seed/c/400/500',
  'https://picsum.photos/seed/d/400/500',
  'https://picsum.photos/seed/e/400/500',
];

const uploaded = (url: string): FeedItem => ({ type: 'uploaded', url });
const local = (
  seed: string,
  status: 'pending' | 'uploading' | 'failed',
): FeedItem => ({
  type: 'local',
  file: new File([], `${seed}.jpg`),
  previewUrl: `https://picsum.photos/seed/${seed}/400/500`,
  status,
});

const Wrapper = ({
  feedItems,
  isLoading = false,
  dragIndex = null,
}: {
  feedItems: FeedItem[];
  isLoading?: boolean;
  dragIndex?: number | null;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ width: 480, padding: 16 }}>
      <FeedImageGrid
        feedItems={feedItems}
        gridRef={gridRef}
        dragIndex={dragIndex}
        dropPosition={null}
        isLoading={isLoading}
        onMouseDown={() => {}}
        onDelete={() => {}}
        onRetry={() => {}}
      />
    </div>
  );
};

const meta = {
  title: 'Admin/PhotoEditTab/FeedImageGrid',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllUploaded: Story = {
  render: () => <Wrapper feedItems={IMAGES.map(uploaded)} />,
};

export const WithPending: Story = {
  render: () => (
    <Wrapper
      feedItems={[
        uploaded(IMAGES[0]),
        uploaded(IMAGES[1]),
        local('x', 'pending'),
        local('y', 'pending'),
      ]}
    />
  ),
};

export const Uploading: Story = {
  render: () => (
    <Wrapper
      isLoading
      feedItems={[
        uploaded(IMAGES[0]),
        uploaded(IMAGES[1]),
        local('x', 'uploading'),
        local('y', 'uploading'),
        local('z', 'uploading'),
      ]}
    />
  ),
};

export const WithFailure: Story = {
  render: () => (
    <Wrapper
      feedItems={[
        uploaded(IMAGES[0]),
        local('x', 'failed'),
        uploaded(IMAGES[2]),
        local('y', 'failed'),
      ]}
    />
  ),
};

export const MixedStatuses: Story = {
  render: () => (
    <Wrapper
      feedItems={[
        uploaded(IMAGES[0]),
        local('p', 'pending'),
        local('u', 'uploading'),
        local('f', 'failed'),
        uploaded(IMAGES[4]),
      ]}
    />
  ),
};

export const Dragging: Story = {
  render: () => {
    const gridRef = useRef<HTMLDivElement>(null);
    return (
      <div style={{ width: 480, padding: 16 }}>
        <FeedImageGrid
          feedItems={IMAGES.map(uploaded)}
          gridRef={gridRef}
          dragIndex={1}
          dropPosition={{ index: 3, side: 'after' }}
          isLoading={false}
          onMouseDown={() => {}}
          onDelete={() => {}}
          onRetry={() => {}}
        />
      </div>
    );
  },
};
