import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IntroducePage from './IntroducePage';

jest.mock('@/components/common/Header/Header', () => ({
  __esModule: true,
  default: () => <div data-testid='mock-header'>Header</div>,
}));

jest.mock('@/components/common/Footer/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid='mock-footer'>Footer</div>,
}));

jest.mock('@/components/common/Spinner/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid='mock-spinner'>Loading...</div>,
}));

jest.mock('@/assets/images/introduce/Introduce.png', () => 'mocked-image-path');

describe('IntroducePage 컴포넌트', () => {
  it('초기 상태에서는 스피너가 표시되고 이미지는 숨겨진다', () => {
    render(<IntroducePage />);

    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();

    const image = screen.getByAltText('소개 이미지');
    expect(image).toHaveStyle({ display: 'none' });
  });

  it('이미지 로드가 완료되면 스피너가 사라지고 이미지가 표시된다', () => {
    render(<IntroducePage />);

    const image = screen.getByAltText('소개 이미지');
    fireEvent.load(image);

    expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();
    expect(image).toHaveStyle({ display: 'block' });
  });

  it('Header와 Footer가 올바르게 렌더링된다', () => {
    render(<IntroducePage />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});
