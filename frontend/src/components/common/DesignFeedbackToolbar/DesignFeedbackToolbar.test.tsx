import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import DesignFeedbackToolbar from './DesignFeedbackToolbar';

jest.mock('agentation', () => ({
  Agentation: () => <div data-testid='agentation' />,
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

  it('인앱 웹뷰에서도 ?design=0이면 localStorage를 지운다', () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    setUserAgent('MoadongApp/1.5.1');
    setSearch('?design=0');
    render(<DesignFeedbackToolbar />);
    expect(localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK)).toBeNull();
  });
});
