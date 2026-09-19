import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ImageItem } from '@/pages/AdminPage/components/ImageSortGrid/types';
import PromotionImageField from './PromotionImageField';

const renderWithImages = (images: ImageItem[]) =>
  render(
    <PromotionImageField
      images={images}
      columns={4}
      onAddFiles={jest.fn()}
      onRemove={jest.fn()}
      onReorder={jest.fn()}
      onReject={jest.fn()}
    />,
  );

const renderField = () => {
  const onAddFiles = jest.fn();
  const onReject = jest.fn();
  const { container } = render(
    <PromotionImageField
      images={[]}
      columns={4}
      onAddFiles={onAddFiles}
      onRemove={jest.fn()}
      onReorder={jest.fn()}
      onReject={onReject}
    />,
  );
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  return { input, onAddFiles, onReject };
};

const selectFiles = (input: HTMLInputElement, files: File[]) =>
  fireEvent.change(input, { target: { files } });

describe('PromotionImageField 파일 선택 검증', () => {
  it('이미지 형식이 아니면 선택 시점에 거부하고 추가하지 않는다', () => {
    const { input, onAddFiles, onReject } = renderField();

    selectFiles(input, [
      new File(['x'], 'poster.png', { type: 'image/png' }),
      new File(['x'], 'plan.pdf', { type: 'application/pdf' }),
    ]);

    expect(onReject).toHaveBeenCalledWith(expect.stringContaining('plan.pdf'));
    expect(onAddFiles).not.toHaveBeenCalled();
  });

  it('허용 형식이면 그대로 추가한다', () => {
    const { input, onAddFiles, onReject } = renderField();
    const file = new File(['x'], 'poster.webp', { type: 'image/webp' });

    selectFiles(input, [file]);

    expect(onReject).not.toHaveBeenCalled();
    expect(onAddFiles).toHaveBeenCalledWith([file]);
  });

  it('10MB를 넘으면 거부한다', () => {
    const { input, onAddFiles, onReject } = renderField();
    const big = new File(['x'], 'big.png', { type: 'image/png' });
    Object.defineProperty(big, 'size', { value: 10 * 1024 * 1024 + 1 });

    selectFiles(input, [big]);

    expect(onReject).toHaveBeenCalledWith(expect.stringContaining('big.png'));
    expect(onAddFiles).not.toHaveBeenCalled();
  });
});

// 자리표시 문구·카운터는 시각 요소라 렌더 여부만 확인한다
it('현재 장수와 상한을 보여준다', () => {
  renderField();
  expect(screen.getByText('0/15')).toBeInTheDocument();
});

describe('업로드 실패 표시', () => {
  const failedItem: ImageItem = {
    type: 'local',
    file: new File(['x'], 'bad.png', { type: 'image/png' }),
    previewUrl: 'blob:bad.png',
    status: 'failed',
  };

  it('실패한 이미지는 실패로 표시하고 업로드 예정으로 보여주지 않는다', () => {
    renderWithImages([failedItem]);

    expect(screen.getByText('실패')).toBeInTheDocument();
    expect(screen.queryByText('업로드 예정')).not.toBeInTheDocument();
  });

  it('재전송 버튼은 두지 않는다 - 홍보는 다시 저장이 곧 재시도다', () => {
    renderWithImages([failedItem]);

    expect(
      screen.queryByRole('button', { name: '재전송' }),
    ).not.toBeInTheDocument();
  });
});
