import { render, screen } from '@testing-library/react';
import { linkifyText } from './linkifyText';

describe('linkifyText', () => {
  it('URL만 있는 경우 링크로 변환된다', () => {
    render(<>{linkifyText('https://example.com')}</>);

    const link = screen.getByRole('link', {
      name: 'https://example.com',
    });

    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('URL이 포함된 텍스트를 링크로 변환한다 (앞뒤 텍스트 포함)', () => {
    const { container } = render(
      <>
        {linkifyText('여기를 참고하세요 https://example.com 감사합니다')}
      </>
    );

    const link = screen.getByRole('link', {
      name: 'https://example.com',
    });

    const text = container.textContent || '';

    expect(text.includes('여기를 참고하세요')).toBe(true);
    expect(text.includes('https://example.com')).toBe(true);
    expect(text.includes('감사합니다')).toBe(true);

    expect(link).not.toBeNull();
  });

  it('URL이 없는 텍스트는 그대로 렌더링된다', () => {
    const { container } = render(
      <>{linkifyText('그냥 텍스트입니다')}</>
    );

    expect(container.textContent).toBe('그냥 텍스트입니다');
  });

  it('여러 개의 URL을 모두 링크로 변환한다', () => {
    render(<>{linkifyText('https://a.com 와 https://b.com')}</>);

    const linkA = screen.getByRole('link', { name: 'https://a.com' });
    const linkB = screen.getByRole('link', { name: 'https://b.com' });

    expect(linkA).not.toBeNull();
    expect(linkB).not.toBeNull();
  });

  it('URL 앞에 붙은 텍스트는 정상적으로 분리된다', () => {
    const { container } = render(
      <>{linkifyText('사이트는https://example.com 입니다')}</>
    );

    const link = screen.getByRole('link', {
      name: 'https://example.com',
    });

    const text = container.textContent || '';

    expect(text.includes('사이트는')).toBe(true);
    expect(text.includes('https://example.com')).toBe(true);
    expect(text.includes('입니다')).toBe(true);

    expect(link).not.toBeNull();
  });

   it('URL 뒤에 한글이 붙은 경우 URL과 분리된다', () => {
    const { container } = render(
      <>{linkifyText('https://example.com입니다')}</>
    );

    const link = screen.getByRole('link', {
      name: 'https://example.com',
    });

    const text = container.textContent || '';

    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(text.includes('https://example.com')).toBe(true);
    expect(text.includes('입니다')).toBe(true);
  });

  it('URL 뒤에 영문이 붙은 경우 URL의 일부로 처리된다', () => {
    const { container } = render(
      <>{linkifyText('https://example.combb')}</>
    );

    const link = screen.getByRole('link');

    expect(link.textContent).toBe('https://example.combb');
    expect(link.getAttribute('href')).toBe(
      'https://example.combb'
    );

    expect(link.getAttribute('href')).toBe('https://example.combb');
    expect(container.textContent).toBe('https://example.combb');
  });
});
