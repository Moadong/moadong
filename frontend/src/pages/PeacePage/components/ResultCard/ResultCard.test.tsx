import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { PEACE_TYPES } from '../../data/peaceTypes';
import ResultCard from './ResultCard';

jest.mock('./cardImages', () => ({
  CARD_IMAGES: { carer: 'carer.webp' },
}));

const renderCard = (id: 'carer' | 'daily') =>
  render(
    <ThemeProvider theme={theme}>
      <ResultCard type={PEACE_TYPES[id]} />
    </ThemeProvider>,
  );

describe('ResultCard', () => {
  it('유형명과 캐치프레이즈를 그린다', () => {
    renderCard('carer');
    expect(screen.getByText('돌봄가')).toBeInTheDocument();
    expect(
      screen.getByText('이웃을 돌보고 나누는 평화 메이커'),
    ).toBeInTheDocument();
  });

  it('이미지가 있으면 img를 그린다', () => {
    renderCard('carer');
    expect(screen.getByRole('img', { name: '돌봄가 카드' })).toHaveAttribute(
      'src',
      'carer.webp',
    );
  });

  it('이미지가 없으면 img 없이 단색 카드를 그린다', () => {
    renderCard('daily');
    expect(
      screen.queryByRole('img', { name: '일상가 카드' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('일상가')).toBeInTheDocument();
  });

  it('카드가 터치 스크롤을 막지 않는다', () => {
    renderCard('daily');
    // styled-components가 head에 넣은 CSS에 touch-action: none이 없어야 브라우저 팬 제스처가 살아 있다
    expect(document.head.textContent).not.toMatch(/touch-action:\s*none/);
  });

  const settle = () =>
    act(async () => {
      await new Promise((r) => setTimeout(r, 600));
    });

  /** jsdom의 fireEvent.pointerMove는 pointerType을 싣지 못하므로 직접 만든다 */
  const tiltWith = async (pointerType: 'mouse' | 'touch') => {
    renderCard('daily');
    const card = screen.getByTestId('result-card');
    card.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    await settle();
    const before = card.style.transform;
    const event = new Event('pointermove', { bubbles: true });
    Object.assign(event, { pointerType, clientX: 90, clientY: 10 });
    act(() => {
      card.dispatchEvent(event);
    });
    await settle();
    return { before, after: card.style.transform };
  };

  it('마우스가 움직이면 카드가 기울어진다', async () => {
    const { before, after } = await tiltWith('mouse');
    expect(after).not.toBe(before);
    expect(after).toMatch(/rotate/);
  });

  it('터치 이동에는 기울어지지 않는다(스크롤 제스처와 충돌 방지)', async () => {
    const { before, after } = await tiltWith('touch');
    expect(after).toBe(before);
  });

  it('유형 심볼과 모아동 로고, 배경 장식을 그린다', () => {
    renderCard('daily');
    expect(screen.getByText(PEACE_TYPES.daily.symbol)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '모아동' })).toBeInTheDocument();
    expect(screen.getByTestId('result-card-decor')).toBeInTheDocument();
  });

  it('이미지가 있으면 심볼 대신 이미지를 보여준다', () => {
    renderCard('carer');
    expect(
      screen.queryByText(PEACE_TYPES.carer.symbol),
    ).not.toBeInTheDocument();
  });

  it('이미지가 없어도 글자 뒤에 어두운 그라데이션을 깔아 대비를 확보한다', () => {
    renderCard('daily');
    // jsdom computed style은 배경 이미지를 캐스케이드하지 않아 head에 삽입된 CSS 규칙을 직접 본다
    const scrim = screen.getByTestId('result-card-scrim');
    const css = document.head.textContent ?? '';
    const rule = [...scrim.classList]
      .map((cls) => css.match(new RegExp(`\\.${cls}\\{[^}]*\\}`))?.[0])
      .find((r) => r?.includes('linear-gradient'));
    expect(rule).toBeDefined();
  });
});
