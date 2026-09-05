import { useRef } from 'react';
import ClearButtonIcon from '@/assets/images/icons/dark_clear_button_icon.svg?react';
import { PROMOTION_IMAGE_MAX_COUNT } from '@/constants/adminFieldLimits';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { LocalImage } from '../../utils/promotionForm';
import * as Styled from './PromotionImageField.styles';

interface PromotionImageFieldProps {
  existingImages: string[];
  localFiles: LocalImage[];
  disabled?: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveExisting: (url: string) => void;
  onRemoveLocal: (index: number) => void;
  /** 파일 제한에 걸렸을 때 안내 문구를 띄운다 */
  onReject: (message: string) => void;
}

const PromotionImageField = ({
  existingImages,
  localFiles,
  disabled = false,
  onAddFiles,
  onRemoveExisting,
  onRemoveLocal,
  onReject,
}: PromotionImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = existingImages.length + localFiles.length;
  const isFull = totalCount >= PROMOTION_IMAGE_MAX_COUNT;

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (selected.length === 0) return;

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      onReject(`${oversized.name}의 용량이 10MB를 초과했습니다.`);
      return;
    }

    const remaining = PROMOTION_IMAGE_MAX_COUNT - totalCount;
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
          {totalCount}/{PROMOTION_IMAGE_MAX_COUNT}
        </Styled.Count>
      </Styled.Header>

      <Styled.Grid>
        {existingImages.map((url) => (
          <Styled.Item key={url}>
            <Styled.Photo src={url} alt='' />
            <Styled.RemoveButton
              type='button'
              aria-label='이미지 삭제'
              disabled={disabled}
              onClick={() => onRemoveExisting(url)}
            >
              <ClearButtonIcon />
            </Styled.RemoveButton>
          </Styled.Item>
        ))}

        {localFiles.map(({ previewUrl }, index) => (
          <Styled.Item key={previewUrl}>
            <Styled.Photo src={previewUrl} alt='' />
            <Styled.PendingBadge>업로드 예정</Styled.PendingBadge>
            <Styled.RemoveButton
              type='button'
              aria-label='이미지 삭제'
              disabled={disabled}
              onClick={() => onRemoveLocal(index)}
            >
              <ClearButtonIcon />
            </Styled.RemoveButton>
          </Styled.Item>
        ))}

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
      </Styled.Grid>

      <Styled.HelperText>
        JPG·PNG·WebP 등 이미지 파일, 장당 10MB 이하. 저장할 때 함께 업로드돼요.
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
