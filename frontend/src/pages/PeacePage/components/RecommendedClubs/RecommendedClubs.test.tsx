import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Club } from '@/types/club';
import RecommendedClubs from './RecommendedClubs';

const mockUseGetCardList = jest.fn();
jest.mock('@/hooks/Queries/useClub', () => ({
  useGetCardList: (args: unknown) => mockUseGetCardList(args),
}));
const club = (name: string, recruitmentStatus: Club['recruitmentStatus']) =>
  ({
    id: name,
    name,
    recruitmentStatus,
    tags: [],
    logo: '',
  }) as unknown as Club;

const renderClubs = (onClubClick = jest.fn()) =>
  render(
    <ThemeProvider theme={theme}>
      <RecommendedClubs
        category='학술'
        accent='#7094FF'
        onClubClick={onClubClick}
      />
    </ThemeProvider>,
  );

describe('RecommendedClubs', () => {
  it('분과로 목록을 요청하고 모집중을 앞세워 태그 3개만 보여준다', () => {
    mockUseGetCardList.mockReturnValue({
      data: {
        totalCount: 4,
        clubs: [
          club('A', 'CLOSED'),
          club('B', 'OPEN'),
          club('C', 'CLOSED'),
          club('D', 'ALWAYS'),
        ],
      },
      isPending: false,
      isError: false,
    });
    renderClubs();
    expect(mockUseGetCardList).toHaveBeenCalledWith(
      expect.objectContaining({ category: '학술' }),
    );
    const names = screen.getAllByRole('button').map((b) => b.textContent);
    expect(names).toEqual(['B', 'D', 'A']);
  });

  it('태그를 누르면 onClubClick에 동아리를 넘긴다', async () => {
    const onClubClick = jest.fn();
    mockUseGetCardList.mockReturnValue({
      data: { totalCount: 1, clubs: [club('B', 'OPEN')] },
      isPending: false,
      isError: false,
    });
    renderClubs(onClubClick);
    await userEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(onClubClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'B' }),
    );
  });

  it('불러오는 동안 안내 문구를 보여준다', () => {
    mockUseGetCardList.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    });
    renderClubs();
    expect(screen.getByText('동아리를 찾는 중이에요')).toBeInTheDocument();
  });

  it('실패하거나 비어 있으면 아무것도 그리지 않는다', () => {
    mockUseGetCardList.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });
    const { container, unmount } = renderClubs();
    expect(container).toBeEmptyDOMElement();
    unmount();
    mockUseGetCardList.mockReturnValue({
      data: { totalCount: 0, clubs: [] },
      isPending: false,
      isError: false,
    });
    expect(renderClubs().container).toBeEmptyDOMElement();
  });
});
