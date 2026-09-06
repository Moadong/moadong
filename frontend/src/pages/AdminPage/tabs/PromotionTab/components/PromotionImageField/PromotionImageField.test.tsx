import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import PromotionImageField from './PromotionImageField';

const renderField = () => {
  const onAddFiles = jest.fn();
  const onReject = jest.fn();
  const { container } = render(
    <PromotionImageField
      existingImages={[]}
      localFiles={[]}
      onAddFiles={onAddFiles}
      onRemoveExisting={jest.fn()}
      onRemoveLocal={jest.fn()}
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
