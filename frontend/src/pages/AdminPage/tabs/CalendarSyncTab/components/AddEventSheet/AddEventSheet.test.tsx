import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import AddEventSheet from './AddEventSheet';

// apis 체인이 import.meta.env를 써서 ts-jest에서 파싱되지 않아 훅만 대체한다
jest.mock('@/hooks/Queries/useCustomCalendarEvents', () => ({
  useCreateCustomCalendarEvent: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// 연동 패널도 같은 apis 체인을 타므로 통째로 대체한다 (반복 탭 검증과 무관)
jest.mock('../CalendarLinkPanel/CalendarLinkPanel', () => ({
  __esModule: true,
  default: () => null,
}));

/** 시트가 Portal로 그려지고, 닫힐 때 부르는 scrollTo는 jsdom에 없다 */
window.scrollTo = jest.fn();

beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'modal-root';
  document.body.appendChild(root);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

const renderSheet = (onClose = jest.fn()) => {
  render(<AddEventSheet isOpen onClose={onClose} initialDate='2026-03-10' />);
  return onClose;
};

describe('AddEventSheet 반복 탭', () => {
  it('시작/종료 날짜를 각각 시트에서 정한다', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));

    // 날짜는 행을 눌러 정하므로 인라인 캘린더는 없다
    expect(screen.getByText('시작 날짜')).toBeInTheDocument();
    expect(screen.queryByText('16')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /2026년 3월 10일/ }));
    fireEvent.click(screen.getByText('16'));

    expect(screen.queryByText('16')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /2026년 3월 16일/ }),
    ).toBeInTheDocument();
  });

  it('종료 날짜는 지정 후 다시 없음으로 되돌릴 수 있다', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));

    fireEvent.click(screen.getByRole('button', { name: /없음/ }));
    fireEvent.click(screen.getByText('20'));
    expect(
      screen.getByRole('button', { name: /2026년 3월 20일/ }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /2026년 3월 20일/ }));
    fireEvent.click(screen.getByRole('button', { name: '종료 기간 없음' }));
    expect(screen.getByRole('button', { name: /없음/ })).toBeInTheDocument();
  });

  // 날짜 시트가 바깥 시트 위에 겹쳐 열리므로, 안쪽만 닫혀도 배경은 잠겨 있어야 한다
  it('날짜 시트를 닫아도 배경 스크롤 잠금이 풀리지 않는다', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));

    fireEvent.click(screen.getByRole('button', { name: /2026년 3월 10일/ }));
    fireEvent.click(screen.getByText('16'));

    expect(document.body.style.position).toBe('fixed');
  });

  // ESC 한 번에 날짜 시트와 일정 시트가 같이 닫히면 안 된다
  it('날짜 시트가 열려 있으면 ESC가 날짜 시트만 닫는다', () => {
    const onClose = renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));
    fireEvent.click(screen.getByRole('button', { name: /2026년 3월 10일/ }));
    expect(screen.getByText('16')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByText('16')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('종료 날짜 시트에서 시작일과 그 이전은 고를 수 없다', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));
    fireEvent.click(screen.getByRole('button', { name: /없음/ }));

    // 시작일이 3월 10일이므로 10일과 그 이전은 비활성
    expect(screen.getByText('9').closest('button')).toBeDisabled();
    expect(screen.getByText('10').closest('button')).toBeDisabled();
    expect(screen.getByText('11').closest('button')).toBeEnabled();
  });

  it('종료 날짜보다 늦은 시작 날짜를 고르면 종료는 없음으로 돌아간다', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));

    fireEvent.click(screen.getByRole('button', { name: /없음/ }));
    fireEvent.click(screen.getByText('15'));
    expect(
      screen.getByRole('button', { name: /2026년 3월 15일/ }),
    ).toBeInTheDocument();

    // 시작을 종료보다 뒤로 옮기면 뒤집힌 기간이 남지 않아야 한다
    fireEvent.click(screen.getByRole('button', { name: /2026년 3월 10일/ }));
    fireEvent.click(screen.getByText('20'));

    expect(
      screen.getByRole('button', { name: /2026년 3월 20일/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /없음/ })).toBeInTheDocument();
  });

  it('시작 날짜 시트에는 종료 기간 없음 버튼이 없다', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('tab', { name: '반복' }));

    fireEvent.click(screen.getByRole('button', { name: /2026년 3월 10일/ }));
    expect(
      screen.queryByRole('button', { name: '종료 기간 없음' }),
    ).not.toBeInTheDocument();
  });
});
