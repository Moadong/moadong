// 소개 전용 헤더의 햄버거 메뉴 열고 닫기(버튼·바깥·Esc)와 앱 웹뷰 뒤로 가기 노출을 검증한다
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SubpageLayout from './SubpageLayout';

jest.mock('@/components/common/Footer/Footer', () => ({
  __esModule: true,
  default: () => null,
}));

const setUserAgent = (ua: string) =>
  Object.defineProperty(window.navigator, 'userAgent', {
    value: ua,
    configurable: true,
  });

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/introduce/updates']}>
      <SubpageLayout>
        <p>본문</p>
      </SubpageLayout>
    </MemoryRouter>,
  );

// 햄버거는 좁은 화면에서만 보이는(데스크톱 display:none) 버튼이라 접근성 이름 대신 aria-label로 찾는다
describe('SubpageLayout 햄버거 메뉴', () => {
  beforeEach(() => setUserAgent('Mozilla/5.0 (iPhone)'));

  it('버튼을 누르면 메뉴가 열리고 aria-expanded가 바뀐다', () => {
    renderLayout();
    const button = screen.getByLabelText('메뉴 열기');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);

    expect(screen.getByLabelText('메뉴 닫기')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(document.getElementById('introduce-mobile-menu')).not.toBeNull();
  });

  it('헤더 안을 누르면 그대로, 바깥을 누르면 닫힌다', () => {
    renderLayout();
    fireEvent.click(screen.getByLabelText('메뉴 열기'));

    fireEvent.pointerDown(screen.getByRole('banner'));
    expect(screen.getByLabelText('메뉴 닫기')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByText('본문'));
    expect(screen.getByLabelText('메뉴 열기')).toBeInTheDocument();
  });

  it('Esc를 누르면 닫힌다', () => {
    renderLayout();
    fireEvent.click(screen.getByLabelText('메뉴 열기'));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByLabelText('메뉴 열기')).toBeInTheDocument();
  });
});

describe('SubpageLayout 뒤로 가기', () => {
  it('앱 웹뷰에서만 뒤로 가기 버튼을 둔다', () => {
    setUserAgent('Mozilla/5.0 (iPhone)');
    const { unmount } = renderLayout();
    expect(screen.queryByRole('button', { name: '뒤로 가기' })).toBeNull();
    unmount();

    setUserAgent('Mozilla/5.0 (iPhone) MoadongApp');
    renderLayout();
    expect(
      screen.getByRole('button', { name: '뒤로 가기' }),
    ).toBeInTheDocument();
  });
});
