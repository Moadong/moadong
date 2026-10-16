import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { FloatingButtonGroup } from './FloatingButtonGroup';

jest.mock('@/hooks/Scroll/useScrollTrigger', () => ({
  useScrollTrigger: () => ({ isScrollingUp: true }),
}));

jest.mock('@/hooks/Scroll/useScrollTo', () => ({
  useScrollTo: () => ({ scrollToTop: jest.fn() }),
}));

jest.mock('@/hooks/useShare', () => ({
  __esModule: true,
  default: () => ({ handleShare: jest.fn() }),
}));

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock('@/hooks/Queries/useClub', () => ({
  useGetClubDetail: () => ({ data: undefined }),
}));

describe('FloatingButtonGroup', () => {
  it('관리자 페이지에서는 렌더링하지 않는다', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <FloatingButtonGroup />
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText('위로 이동하기')).toBeNull();
    expect(screen.queryByLabelText('현재 페이지 공유하기')).toBeNull();
  });
});
