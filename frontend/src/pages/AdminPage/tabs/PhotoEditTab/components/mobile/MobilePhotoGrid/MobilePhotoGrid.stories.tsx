import type { Meta, StoryObj } from '@storybook/react';
import { FeedItem } from '../../../types';
import { MobilePhotoGrid } from './MobilePhotoGrid';

const SAMPLE_IMAGES: FeedItem[] = [
  {
    type: 'uploaded',
    url: 'https://picsum.photos/seed/photo1/246/320',
  },
  {
    type: 'uploaded',
    url: 'https://picsum.photos/seed/photo2/246/320',
  },
  {
    type: 'uploaded',
    url: 'https://picsum.photos/seed/photo3/246/320',
  },
  {
    type: 'uploaded',
    url: 'https://picsum.photos/seed/photo4/246/320',
  },
  {
    type: 'uploaded',
    url: 'https://picsum.photos/seed/photo5/246/320',
  },
];

const meta = {
  title:
    'Pages/AdminPage/tabs/PhotoEditTab/components/mobile/MobilePhotoGrid',
  component: MobilePhotoGrid,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobilePhotoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feedItems: SAMPLE_IMAGES,
    isLoading: false,
    onDelete: () => {},
  },
};

export const WithPending: Story = {
  args: {
    feedItems: [
      ...SAMPLE_IMAGES.slice(0, 3),
      {
        type: 'local',
        file: new File([], 'pending.jpg'),
        previewUrl: 'https://picsum.photos/seed/photo6/246/320',
        status: 'pending',
      },
      {
        type: 'local',
        file: new File([], 'uploading.jpg'),
        previewUrl: 'https://picsum.photos/seed/photo7/246/320',
        status: 'uploading',
      },
      {
        type: 'local',
        file: new File([], 'failed.jpg'),
        previewUrl: 'https://picsum.photos/seed/photo8/246/320',
        status: 'failed',
      },
    ],
    isLoading: true,
    onDelete: () => {},
  },
};
