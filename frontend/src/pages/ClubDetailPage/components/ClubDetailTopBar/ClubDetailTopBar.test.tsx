import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import ClubDetailTopBar, {
  PERMISSION_SNACKBAR_ACTION_LABEL,
  PERMISSION_SNACKBAR_MESSAGE,
  SUBSCRIBED_TOAST_MESSAGE,
} from './ClubDetailTopBar';

jest.mock('mixpanel-browser', () => ({ track: jest.fn() }));

const CLUB_ID = 'club-1';
const postMessage = jest.fn();

const renderTopBar = (initialIsSubscribed = false) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <ClubDetailTopBar
          clubId={CLUB_ID}
          clubName='테스트'
          initialIsSubscribed={initialIsSubscribed}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );

const sentTypes = () =>
  postMessage.mock.calls.map(([raw]) => JSON.parse(raw).type);

/** 앱이 SUBSCRIBE_RESULT를 회신하는 상황을 흉내 낸다 */
const replyFromApp = (subscribed: boolean, needsPermission = false) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          type: 'SUBSCRIBE_RESULT',
          payload: { clubId: CLUB_ID, subscribed, needsPermission },
        }),
      }),
    );
  });

beforeEach(() => {
  jest.clearAllMocks();
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
  Object.defineProperty(navigator, 'userAgent', {
    value: 'MoadongApp/1.7.1 (iOS)',
    configurable: true,
  });
  window.ReactNativeWebView = { postMessage };
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
  delete window.ReactNativeWebView;
});

describe('구독 중이 아닐 때', () => {
  it('종을 누르면 바로 앱에 토글을 보낸다', async () => {
    renderTopBar(false);

    await userEvent.click(screen.getByRole('button', { name: '알림 설정' }));

    expect(sentTypes()).toEqual(['SUBSCRIBE_TOGGLE']);
  });

  it('앱이 구독 완료를 회신하면 완료 토스트를 띄운다', () => {
    renderTopBar(false);

    replyFromApp(true);

    expect(screen.getByRole('status')).toHaveTextContent(
      SUBSCRIBED_TOAST_MESSAGE,
    );
  });

  it('앱이 권한 부족을 회신하면 권한 안내 스낵바를 띄운다', () => {
    renderTopBar(false);

    replyFromApp(false, true);

    expect(screen.getByRole('status')).toHaveTextContent(
      PERMISSION_SNACKBAR_MESSAGE,
    );
  });

  it('권한 안내 스낵바는 표면이 아니라 안에 든 버튼이 액션을 갖는다', () => {
    renderTopBar(false);

    replyFromApp(false, true);

    const toast = screen.getByRole('status');
    const action = screen.getByRole('button', {
      name: PERMISSION_SNACKBAR_ACTION_LABEL,
    });

    expect(toast).not.toBe(action);
    expect(toast).toContainElement(action);
  });

  it('권한 안내 스낵바의 액션을 누르면 앱에 설정 화면 열기를 요청하고 스낵바를 닫는다', async () => {
    renderTopBar(false);
    replyFromApp(false, true);

    await userEvent.click(
      screen.getByRole('button', { name: PERMISSION_SNACKBAR_ACTION_LABEL }),
    );

    expect(sentTypes()).toEqual(['OPEN_APP_SETTINGS']);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('완료 토스트에는 액션이 없고 표면은 입력을 가리지 않는다', () => {
    renderTopBar(false);
    replyFromApp(true);

    const toast = screen.getByRole('status');

    expect(within(toast).queryByRole('button')).not.toBeInTheDocument();
    expect(getComputedStyle(toast).pointerEvents).toBe('none');
  });
});

describe('구독 중일 때', () => {
  it('종을 누르면 확인 없이 바로 앱에 토글을 보낸다', async () => {
    renderTopBar(true);

    await userEvent.click(screen.getByRole('button', { name: '알림 설정' }));

    expect(sentTypes()).toEqual(['SUBSCRIBE_TOGGLE']);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('구독 해제 회신에는 토스트를 띄우지 않는다', () => {
    renderTopBar(true);

    replyFromApp(false);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
