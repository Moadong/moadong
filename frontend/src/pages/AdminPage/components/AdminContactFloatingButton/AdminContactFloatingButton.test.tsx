import { render, screen } from '@testing-library/react';
import AdminContactFloatingButton from './AdminContactFloatingButton';

describe('AdminContactFloatingButton', () => {
  it('운영진 카카오 오픈채팅 링크를 새 탭으로 연다', () => {
    render(<AdminContactFloatingButton />);

    const link = screen.getByRole('link', {
      name: '모아동 운영진 카카오 오픈채팅 열기',
    });

    expect(link.getAttribute('href')).toBe('https://open.kakao.com/o/s21dRWjh');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByText('운영진 문의')).not.toBeNull();
  });
});
