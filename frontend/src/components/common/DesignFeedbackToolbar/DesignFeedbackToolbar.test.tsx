import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import DesignFeedbackToolbar from './DesignFeedbackToolbar';

let mockOnCopy: ((markdown: string) => void) | undefined;

jest.mock('agentation', () => ({
  Agentation: ({ onCopy }: { onCopy?: (markdown: string) => void }) => {
    mockOnCopy = onCopy;
    return <div data-testid='agentation' />;
  },
}));

const setSearch = (search: string) => {
  window.history.replaceState({}, '', `/${search}`);
};

const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
    configurable: true,
  });
};

beforeEach(() => {
  localStorage.clear();
  setSearch('');
  setUserAgent('Mozilla/5.0');
});

describe('DesignFeedbackToolbar', () => {
  it('기본 상태에서는 렌더하지 않는다', () => {
    render(<DesignFeedbackToolbar />);
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
  });

  it('?design=1이면 켜고 localStorage에 남긴다', async () => {
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    expect(await screen.findByTestId('agentation')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK)).toBe('1');
  });

  it('localStorage에 남아 있으면 쿼리가 없어도 켠다', async () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    render(<DesignFeedbackToolbar />);
    expect(await screen.findByTestId('agentation')).toBeInTheDocument();
  });

  it('켤 때 툴바 출력을 detailed로 심는다', async () => {
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    await screen.findByTestId('agentation');
    expect(
      JSON.parse(localStorage.getItem('feedback-toolbar-settings') ?? '{}'),
    ).toEqual({ outputDetail: 'detailed' });
  });

  it('디자이너가 바꿔 둔 툴바 설정은 덮지 않는다', async () => {
    const mine = JSON.stringify({ outputDetail: 'forensic' });
    localStorage.setItem('feedback-toolbar-settings', mine);
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    await screen.findByTestId('agentation');
    expect(localStorage.getItem('feedback-toolbar-settings')).toBe(mine);
  });

  it('?design=0이면 끄고 localStorage를 지운다', () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    setSearch('?design=0');
    render(<DesignFeedbackToolbar />);
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK)).toBeNull();
  });

  it('인앱 웹뷰에서는 켜져 있어도 렌더하지 않는다', () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    setUserAgent('MoadongApp/1.5.1');
    render(<DesignFeedbackToolbar />);
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
  });

  it('localStorage가 던지면 렌더하지 않고 조용히 넘어간다', () => {
    setSearch('?design=1');
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
    expect(() => render(<DesignFeedbackToolbar />)).not.toThrow();
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
    setItem.mockRestore();
  });

  it('복사하면 피드백이 채워진 이슈 폼을 연다', async () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    await screen.findByTestId('agentation');

    mockOnCopy?.('**Classes:** Headerstyles__Container-NuEt\n8px 줄여줘');

    const [url, target] = open.mock.calls[0];
    expect(url).toBe(
      'https://github.com/Moadong/moadong/issues/new?template=design-feedback.yml' +
        '&feedback=**Classes%3A**%20Headerstyles__Container-NuEt%0A8px%20%EC%A4%84%EC%97%AC%EC%A4%98',
    );
    expect(target).toBe('_blank');
    open.mockRestore();
  });

  it('프리필이 URL 한계를 넘으면 앞부분만 담고 잘렸다고 알린다', async () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    await screen.findByTestId('agentation');

    // 한글은 인코딩하면 한 자가 9자가 된다. 1,000자면 9,000자라 한계를 넘는다.
    mockOnCopy?.('줄'.repeat(1000));

    const [url, target] = open.mock.calls[0] as [string, string];
    expect(url.length).toBeLessThanOrEqual(6000);
    const feedback = new URL(url).searchParams.get('feedback') ?? '';
    expect(feedback.startsWith('줄줄줄')).toBe(true);
    expect(feedback).toContain('길어서 여기까지만 담겼어요');
    expect(target).toBe('_blank');
    open.mockRestore();
  });

  it('자를 때 이모지를 반으로 가르지 않는다', async () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    await screen.findByTestId('agentation');

    expect(() => mockOnCopy?.('🎨'.repeat(2000))).not.toThrow();
    expect(open).toHaveBeenCalledTimes(1);
    open.mockRestore();
  });

  it('인앱 웹뷰에서도 ?design=0이면 localStorage를 지운다', () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    setUserAgent('MoadongApp/1.5.1');
    setSearch('?design=0');
    render(<DesignFeedbackToolbar />);
    expect(localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK)).toBeNull();
  });
});
