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
    value: 'Mozilla/5.0 (iPhone) MoadongApp/1.6.0',
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

  it('「넵!」은 만족으로 남기고 스토어 리뷰로 보낸다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '넵!' }));

    expect(mixpanel.track).toHaveBeenCalledWith(
      USER_EVENT.SATISFACTION_ANSWERED,
      expect.objectContaining({ satisfied: true }),
    );
    expect(window.open).toHaveBeenCalledWith(
      APP_STORE_REVIEW_URL,
      '_blank',
      'noopener',
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('「아니요」는 불만으로 남기고 스토어가 아니라 우체통으로 보낸다', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: '아니요' }));

    expect(mixpanel.track).toHaveBeenCalledWith(
      USER_EVENT.SATISFACTION_ANSWERED,
      expect.objectContaining({ satisfied: false }),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/feedback/write');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('「다음에 볼게요」는 미룸으로 남기고 답한 것으로 치지 않는다', async () => {
    renderModal();

    await userEvent.click(
      screen.getByRole('button', { name: '다음에 볼게요' }),
    );

    expect(trackedNames()).toContain(USER_EVENT.SATISFACTION_SNOOZED);
    expect(localStorage.getItem(STORAGE_KEYS.SATISFACTION_ANSWERED)).toBeNull();
  });
});
