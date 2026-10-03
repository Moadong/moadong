import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mixpanel from 'mixpanel-browser';
import {
  APP_STORE_REVIEW_URL,
  SATISFACTION_ASK_THRESHOLD,
} from '@/constants/appReview';
import { USER_EVENT } from '@/constants/eventName';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import SatisfactionModal from './SatisfactionModal';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const trackedNames = () =>
  (mixpanel.track as jest.Mock).mock.calls.map(([name]) => name);

const renderModal = () =>
  render(
    <MemoryRouter>
      <SatisfactionModal />
    </MemoryRouter>,
  );

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  // Portal이 붙을 자리. 실제 앱에서는 index.html에 있다.
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
  Object.defineProperty(navigator, 'userAgent', {
    value: 'MoadongApp/1.6.0 (iOS)',
    configurable: true,
  });
  // 노출 조건을 미리 채운다
  localStorage.setItem(
    STORAGE_KEYS.CLUB_VIEW_COUNT,
    String(SATISFACTION_ASK_THRESHOLD),
  );
  window.open = jest.fn();
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

describe('SatisfactionModal', () => {
  it('노출되면 응답률의 분모가 될 이벤트를 한 번 남긴다', () => {
    const { rerender } = renderModal();

    expect(trackedNames()).toEqual([USER_EVENT.SATISFACTION_SHOWN]);

    // 리렌더로 중복 발화되지 않아야 한다
    rerender(
      <MemoryRouter>
        <SatisfactionModal />
      </MemoryRouter>,
    );
    expect(trackedNames()).toEqual([USER_EVENT.SATISFACTION_SHOWN]);
  });

  it('「좋아요!」는 만족으로 남기고 리뷰 유도 모달을 띄운다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '좋아요!' }));

    expect(mixpanel.track).toHaveBeenCalledWith(
      USER_EVENT.SATISFACTION_ANSWERED,
      expect.objectContaining({ satisfied: true }),
    );
    expect(screen.getByText('앱이 마음에 드시나요?')).toBeInTheDocument();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('리뷰 모달에서 「물론이죠!」는 스토어 리뷰로 보낸다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '좋아요!' }));
    await userEvent.click(screen.getByRole('button', { name: '물론이죠!' }));

    expect(trackedNames()).toContain(USER_EVENT.SATISFACTION_REVIEWED);
    expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBe(
      'true',
    );
    expect(window.open).toHaveBeenCalledWith(
      APP_STORE_REVIEW_URL,
      '_blank',
      'noopener',
    );
  });

  it('리뷰 모달에서 「나중에 할게요」는 스토어로 보내지 않고 스누즈한다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '좋아요!' }));
    await userEvent.click(
      screen.getByRole('button', { name: '나중에 할게요' }),
    );

    expect(window.open).not.toHaveBeenCalled();
    expect(screen.queryByText('앱이 마음에 드시나요?')).not.toBeInTheDocument();
    expect(trackedNames()).toContain(USER_EVENT.SATISFACTION_SNOOZED);
    expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('0');
    expect(localStorage.getItem(STORAGE_KEYS.CLUB_VIEW_COUNT)).toBe('0');
    expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBeNull();
  });

  it('「아쉬워요」는 불만으로 남기고 피드백 유도 모달을 띄운다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '아쉬워요' }));

    expect(mixpanel.track).toHaveBeenCalledWith(
      USER_EVENT.SATISFACTION_ANSWERED,
      expect.objectContaining({ satisfied: false }),
    );
    expect(screen.getByText('함께 개선해요')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('피드백 모달에서 「피드백하기」는 우체통으로 보낸다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '아쉬워요' }));
    await userEvent.click(screen.getByRole('button', { name: '피드백하기' }));

    expect(trackedNames()).toContain(USER_EVENT.SATISFACTION_FEEDBACK);
    expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBe(
      'true',
    );
    expect(mockNavigate).toHaveBeenCalledWith('/feedback/write');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('피드백 모달에서 「다음에 할게요」는 피드백 없이 스누즈한다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '아쉬워요' }));
    await userEvent.click(
      screen.getByRole('button', { name: '다음에 할게요' }),
    );

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.queryByText('함께 개선해요')).not.toBeInTheDocument();
    expect(trackedNames()).toContain(USER_EVENT.SATISFACTION_SNOOZED);
    expect(localStorage.getItem(STORAGE_KEYS.VISIT_DAY_COUNT)).toBe('0');
    expect(localStorage.getItem(STORAGE_KEYS.CLUB_VIEW_COUNT)).toBe('0');
    expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBeNull();
  });

  it('ESC 키로 닫으면 스누즈한다', async () => {
    renderModal();

    await userEvent.keyboard('{Escape}');

    expect(trackedNames()).toContain(USER_EVENT.SATISFACTION_SNOOZED);
    expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBeNull();
  });
});
