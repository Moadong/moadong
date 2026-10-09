import { useEffect, useRef } from 'react';
import { PROMOTION_IMAGE_MAX_COUNT } from '@/constants/adminFieldLimits';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { ImageSortGrid } from '@/pages/AdminPage/components/ImageSortGrid/ImageSortGrid';
import { ImageItem } from '@/pages/AdminPage/components/ImageSortGrid/types';
import { useDragSort } from '@/pages/AdminPage/components/ImageSortGrid/useDragSort';
import * as Styled from './PromotionImageField.styles';

interface PromotionImageFieldProps {
  images: ImageItem[];
  columns: number;
  disabled?: boolean;
  onAddFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
  onReorder: (images: ImageItem[]) => void;
  /** 파일 제한에 걸렸을 때 안내 문구를 띄운다 */
  onReject: (message: string) => void;
}

const PromotionImageField = ({
  images,
  columns,
  disabled = false,
  onAddFiles,
  onRemove,
  onReorder,
  onReject,
}: PromotionImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const { gridRef, dragIndex, dropPosition, handleMouseDown } = useDragSort({
    disabled,
    onReorder,
    itemsRef: imagesRef,
  });

  const isFull = images.length >= PROMOTION_IMAGE_MAX_COUNT;

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (selected.length === 0) return;

    const unsupported = selected.find(
      (file) => !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
    );
    if (unsupported) {
      onReject(
        `${unsupported.name}은(는) 지원하지 않는 형식입니다. JPG·PNG·GIF·BMP·WebP만 올릴 수 있어요.`,
      );
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      onReject(`${oversized.name}의 용량이 10MB를 초과했습니다.`);
      return;
    }

    const remaining = PROMOTION_IMAGE_MAX_COUNT - images.length;
    if (selected.length > remaining) {
      onReject(
        `이미지는 최대 ${PROMOTION_IMAGE_MAX_COUNT}장까지 등록할 수 있습니다.`,
      );
    }
    onAddFiles(selected.slice(0, Math.max(remaining, 0)));
  };

  return (
    <div>
      <Styled.Header>
        <Styled.Label>행사 이미지</Styled.Label>
        <Styled.Count>
          {images.length}/{PROMOTION_IMAGE_MAX_COUNT}
        </Styled.Count>
      </Styled.Header>

      <ImageSortGrid
        items={images}
        gridRef={gridRef}
        dragIndex={dragIndex}
        dropPosition={dropPosition}
        isLoading={disabled}
        columns={columns}
        onMouseDown={handleMouseDown}
        onDelete={onRemove}
      >
        {!isFull && (
          <Styled.AddTile
            type='button'
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            <span aria-hidden>+</span>
            <span>이미지 추가</span>
          </Styled.AddTile>
        )}
      </ImageSortGrid>

      <Styled.HelperText>
        JPG·PNG·WebP 등 이미지 파일, 장당 10MB 이하. 저장할 때 함께 업로드돼요.
        끌어서 순서를 바꿀 수 있어요.
      </Styled.HelperText>

      <input
        ref={inputRef}
        type='file'
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        multiple
        hidden
        onChange={handleFilesSelected}
      />
    </div>
  );
};

export default PromotionImageField;
