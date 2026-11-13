import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { USER_EVENT } from '@/constants/eventName';
import Footer from './Footer';

const mockTrackEvent = jest.fn();

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => mockTrackEvent,
}));

describe('Footer 인스타그램 링크', () => {
  beforeEach(() => {
    mockTrackEvent.mockClear();
  });

  it('모아동 인스타그램을 새 탭으로 연다', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: '인스타그램 @_moadong' });
    expect(link.getAttribute('href')).toBe(
      'https://www.instagram.com/_moadong/',
    );
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('클릭하면 현재 페이지 경로와 함께 이벤트를 보낸다', () => {
    render(
      <MemoryRouter initialEntries={['/club/abc']}>
        <Footer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: '인스타그램 @_moadong' }));

    expect(mockTrackEvent).toHaveBeenCalledWith(
      USER_EVENT.FOOTER_INSTAGRAM_CLICKED,
      { page: '/club/abc' },
    );
  });
});
