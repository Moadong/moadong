import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import PhotoModal from './PhotoModal';

// jsdom에서는 Swiper를 그릴 수 없어서, 슬라이드를 그대로 그리고 슬라이드 변경을 테스트가 직접 일으킨다.
let fireSlideChange: (realIndex: number) => void = () => {};
jest.mock('swiper/react', () => ({
  Swiper: ({
    children,
    onSlideChange,
  }: {
    children: React.ReactNode;
    onSlideChange: (swiper: { realIndex: number }) => void;
  }) => {
    fireSlideChange = (realIndex) => onSlideChange({ realIndex });
    return <div>{children}</div>;
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock('swiper/modules', () => ({ Keyboard: {}, Navigation: {} }));
jest.mock('swiper/css/navigation', () => ({}));

const urls = Array.from(
  { length: 7 },
  (_, i) => `https://cdn.moadong.com/club/feed/${i}.jpg`,
);

const renderModal = (currentIndex: number, onChangeIndex = jest.fn()) =>
  render(
    <ThemeProvider theme={theme}>
      <PhotoModal
        isOpen
        onClose={jest.fn()}
        clubName='테스트 동아리'
        photos={{ currentIndex, urls, onChangeIndex }}
      />
    </ThemeProvider>,
  );

// 본 이미지만 센다. 썸네일은 alt가 '썸네일'이라 제외된다.
const loadedSlides = () =>
  screen
    .queryAllByAltText(/^활동 사진 \d+$/)
    .map((img) => img.getAttribute('alt'));

beforeEach(() => {
  // jsdom에는 없다. 썸네일 자동 스크롤용이라 이 테스트와는 관계없다.
  Element.prototype.scrollIntoView = jest.fn();
  // 공용 Modal의 스크롤 잠금이 닫힐 때 부른다. jsdom에는 구현이 없다.
  window.scrollTo = jest.fn();
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  document.getElementById('modal-root')?.remove();
});

describe('PhotoModal 본 이미지 지연 로딩', () => {
  it('열 때는 누른 사진과 양옆만 본 이미지를 요청한다', () => {
    renderModal(3);

    expect(loadedSlides()).toEqual([
      '활동 사진 3',
      '활동 사진 4',
      '활동 사진 5',
    ]);
  });

  it('본 이미지는 Cloudflare에서 긴 변 2400px로 줄인 주소로 요청한다', () => {
    renderModal(3);

    expect(screen.getByAltText('활동 사진 4').getAttribute('src')).toBe(
      'https://cdn.moadong.com/cdn-cgi/image/format=auto,width=2400,height=2400,fit=scale-down/club/feed/3.jpg',
    );
  });

  it('썸네일은 전부 그린다', () => {
    renderModal(3);

    expect(screen.getAllByAltText('썸네일')).toHaveLength(urls.length);
  });

  it('첫 장에서 열면 loop 이웃인 마지막 장도 요청한다', () => {
    renderModal(0);

    expect(loadedSlides()).toEqual([
      '활동 사진 1',
      '활동 사진 2',
      '활동 사진 7',
    ]);
  });

  it('넘긴 뒤에도 이미 불러온 사진은 남겨 둔다', () => {
    const onChangeIndex = jest.fn();
    const { rerender } = renderModal(3, onChangeIndex);

    act(() => fireSlideChange(5));
    expect(onChangeIndex).toHaveBeenCalledWith(5);
    rerender(
      <ThemeProvider theme={theme}>
        <PhotoModal
          isOpen
          onClose={jest.fn()}
          clubName='테스트 동아리'
          photos={{ currentIndex: 5, urls, onChangeIndex }}
        />
      </ThemeProvider>,
    );

    expect(loadedSlides()).toEqual([
      '활동 사진 3',
      '활동 사진 4',
      '활동 사진 5',
      '활동 사진 6',
      '활동 사진 7',
    ]);
  });
});
