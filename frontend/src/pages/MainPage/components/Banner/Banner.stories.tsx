import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import Banner from './Banner';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const mockWebBanners = [
  {
    id: 'web-banner-1',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400',
    linkTo: '/introduce',
    alt: '데스크톱 배너 1',
  },
  {
    id: 'web-banner-2',
    imageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400',
    linkTo: 'APP_STORE_LINK',
    alt: '데스크톱 배너 2',
  },
];

const mockMobileBanners = [
  {
    id: 'mobile-banner-1',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    linkTo: '/introduce',
    alt: '모바일 배너 1',
  },
  {
    id: 'mobile-banner-2',
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    linkTo: null,
    alt: '모바일 배너 2',
  },
];

const setViewportWidth = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const withProviders = (width: number) => (Story: () => ReactNode) => {
  setViewportWidth(width);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const bannerHandler = http.get(`${API_BASE_URL}/api/banner`, ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type === 'WEB_MOBILE') {
    return HttpResponse.json({
      statuscode: '200',
      message: 'success',
      images: mockMobileBanners,
    });
  }

  return HttpResponse.json({
    statuscode: '200',
    message: 'success',
    images: mockWebBanners,
  });
});

const meta = {
  title: 'Pages/MainPage/Components/Banner',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '메인 페이지 상단 배너 슬라이더입니다. API 응답과 폴백 동작을 스토리에서 확인합니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  decorators: [withProviders(1280)],
  parameters: {
    msw: {
      handlers: [bannerHandler],
    },
  },
};

export const Mobile: Story = {
  decorators: [withProviders(375)],
  parameters: {
    msw: {
      handlers: [bannerHandler],
    },
  },
};

export const Fallback: Story = {
  decorators: [withProviders(1280)],
  parameters: {
    msw: {
      handlers: [
        http.get(`${API_BASE_URL}/api/banner`, () =>
          HttpResponse.json({
            statuscode: '200',
            message: 'success',
            images: [],
          }),
        ),
      ],
    },
  },
};
