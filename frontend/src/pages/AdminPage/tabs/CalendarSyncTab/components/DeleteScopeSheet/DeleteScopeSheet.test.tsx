import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DeleteScopeSheet from './DeleteScopeSheet';

/** Modal이 닫힐 때 스크롤을 복원하는데 jsdom에는 구현이 없다 */
window.scrollTo = jest.fn();

/** Modal이 Portal로 그려져서 마운트 지점이 없으면 아무것도 렌더되지 않는다 */
beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'modal-root';
  document.body.appendChild(root);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

const renderSheet = (
  props: Partial<React.ComponentProps<typeof DeleteScopeSheet>>,
) =>
  render(
    <DeleteScopeSheet
      isOpen
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      {...props}
    />,
  );

describe('DeleteScopeSheet', () => {
  it('반복 일정 삭제는 범위 선택지를 보여준다', () => {
    renderSheet({ showScopeOptions: true });

    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.queryByText('이 일정을 삭제할까요?')).not.toBeInTheDocument();
    expect(screen.getByText('일정 삭제하기')).toBeInTheDocument();
  });

  it('반복이 아닌 일정 삭제는 확인 문구만 보여준다', () => {
    renderSheet({ showScopeOptions: false });

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.getByText('이 일정을 삭제할까요?')).toBeInTheDocument();
  });

  // 숨김 요청은 scope를 쓰지 않으므로 showScopeOptions보다 우선해야 한다
  it('연동 일정 숨김은 반복 일정이어도 범위 선택지를 감춘다', () => {
    renderSheet({ showScopeOptions: true, isHiding: true });

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(
      screen.getByText('이 일정을 캘린더에서 숨길까요?'),
    ).toBeInTheDocument();
    expect(screen.getByText('캘린더에서 숨기기')).toBeInTheDocument();
  });
});
