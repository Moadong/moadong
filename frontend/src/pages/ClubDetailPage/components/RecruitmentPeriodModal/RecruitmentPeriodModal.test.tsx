import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ClubDetail } from '@/types/club';
import RecruitmentPeriodModal from './RecruitmentPeriodModal';

const mockMutate = jest.fn();

jest.mock('@/hooks/Queries/useClub', () => ({
  useUpdateClubDescription: () => ({ mutate: mockMutate, isPending: false }),
}));

jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

// 2026-10-05 12:00 KST
const NOW = new Date('2026-10-05T03:00:00Z');

const renderModal = (detail: Partial<ClubDetail>) =>
  render(
    <RecruitmentPeriodModal
      isOpen
      onClose={jest.fn()}
      onSuccess={jest.fn()}
      clubDetail={
        {
          id: 'club-1',
          recruitmentTarget: '',
          recruitmentStatus: 'OPEN',
          recruitmentStart: '2026.10.01 00:00',
          recruitmentEnd: '2026.10.06 23:59',
          ...detail,
        } as ClubDetail
      }
    />,
  );

const confirmButton = () => screen.getByRole('button', { name: '확인' });

const sentRecruitmentEnd = () =>
  new Date(mockMutate.mock.calls[0][0].recruitmentEnd);

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
  mockMutate.mockReset();
  // Modal의 스크롤 잠금이 닫힐 때 부르는데 jsdom에 구현이 없다
  window.scrollTo = jest.fn();
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.replaceChildren(modalRoot);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('RecruitmentPeriodModal', () => {
  it('조기 마감일이 지금 마감일보다 늦으면 저장할 수 없다', () => {
    renderModal({});

    fireEvent.change(screen.getByLabelText('조기 마감 일수'), {
      target: { value: '30' },
    });

    expect(confirmButton()).toBeDisabled();
    expect(screen.getByText('→ 10월 6일 전이어야 해요')).toBeInTheDocument();
  });

  it('지금 마감일보다 이른 조기 마감은 오늘부터 N일 뒤로 저장한다', () => {
    renderModal({ recruitmentEnd: '2026.10.20 23:59' });

    fireEvent.change(screen.getByLabelText('조기 마감 일수'), {
      target: { value: '3' },
    });
    fireEvent.click(confirmButton());

    expect(sentRecruitmentEnd().toISOString()).toBe('2026-10-08T03:00:00.000Z');
  });

  it('일수 없이 상시 모집을 해제하면 지난 시작일이 아니라 지금으로 마감한다', () => {
    renderModal({
      recruitmentStatus: 'ALWAYS',
      recruitmentStart: '2026.03.01 00:00',
      recruitmentEnd: '2999.03.01 00:00',
    });

    fireEvent.click(screen.getByRole('button', { name: '상시 모집 해제' }));
    fireEvent.click(confirmButton());

    expect(sentRecruitmentEnd().getTime()).toBe(NOW.getTime());
  });

  it('상시 모집 토글의 선택 상태를 보조 기술에 알린다', () => {
    renderModal({});
    const toggle = screen.getByRole('button', { name: '상시 모집으로 전환' });

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('저장에 실패하면 알린다', () => {
    const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockMutate.mockImplementation((_data, { onError }) => onError());
    renderModal({});

    fireEvent.change(screen.getByLabelText('기간 연장 일수'), {
      target: { value: '3' },
    });
    fireEvent.click(confirmButton());

    expect(alert).toHaveBeenCalledWith(
      '모집 기간 변경에 실패했어요. 다시 시도해주세요.',
    );
    alert.mockRestore();
  });
});
