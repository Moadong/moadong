import AddPhotoIcon from '@/assets/images/icons/add_photo_icon.svg?react';
import { MAX_FILE_COUNT } from '@/constants/uploadLimit';
import * as Styled from './PhotoUploadCard.styles';

interface PhotoUploadCardProps {
  count: number;
  disabled?: boolean;
  onClick: () => void;
}

const PhotoUploadCard = ({
  count,
  disabled = false,
  onClick,
}: PhotoUploadCardProps) => {
  const label =
    count === 0
      ? `이미지 업로드 (${count}/${MAX_FILE_COUNT})`
      : `이미지 추가 등록 (${count}/${MAX_FILE_COUNT})`;

  return (
    <Styled.Card onClick={onClick} disabled={disabled}>
      <AddPhotoIcon width={56} height={56} />
      <Styled.Label>{label}</Styled.Label>
    </Styled.Card>
  );
};

export default PhotoUploadCard;
