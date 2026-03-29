import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import type { ClubDetail } from '@/types/club';
import PhotoEditTab from './PhotoEditTab';

const SAMPLE_FEEDS = [
  'https://picsum.photos/seed/a/400/500',
  'https://picsum.photos/seed/b/400/500',
  'https://picsum.photos/seed/c/400/500',
  'https://picsum.photos/seed/d/400/500',
  'https://picsum.photos/seed/e/400/500',
];

const mockClubDetail = (feeds: string[]): ClubDetail => ({
  id: 'club-1',
  name: '테스트 동아리',
  logo: '',
  tags: [],
  recruitmentStatus: 'OPEN',
  division: '',
  category: '',
  introduction: '',
  description: {
    introDescription: '',
    activityDescription: '',
    awards: [],
    idealCandidate: { tags: [], content: '' },
    benefits: '',
    faqs: [],
  },
  state: '',
  feeds,
  presidentName: '',
  presidentPhoneNumber: '',
  recruitmentForm: '',
  recruitmentStart: '',
  recruitmentEnd: '',
  recruitmentTarget: '',
  socialLinks: {} as ClubDetail['socialLinks'],
});

const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const Wrapper = ({ feeds = SAMPLE_FEEDS }: { feeds?: string[] }) => (
  <QueryClientProvider client={makeQueryClient()}>
    <div style={{ maxWidth: 600, padding: 24 }}>
      <MemoryRouter initialEntries={['/admin/photo']}>
        <Routes>
          <Route path="/admin/photo" element={<Outlet context={mockClubDetail(feeds)} />}>
            <Route index element={<PhotoEditTab />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </div>
  </QueryClientProvider>
);

const meta = {
  title: 'Admin/PhotoEditTab',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const WithPhotos: Story = {
  render: () => <Wrapper />,
};

export const Empty: Story = {
  render: () => <Wrapper feeds={[]} />,
};

export const ManyPhotos: Story = {
  render: () => (
    <Wrapper
      feeds={Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/${i + 10}/400/500`)}
    />
  ),
};
