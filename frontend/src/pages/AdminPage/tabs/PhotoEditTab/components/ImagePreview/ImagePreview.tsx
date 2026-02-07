import delete_button_icon from '@/assets/images/icons/input_clear_button_icon.svg';
import * as Styled from './ImagePreview.styles';

interface ImagePreviewProps {
  image: string;
  onDelete: () => void;
  disabled?: boolean;
}

export const ImagePreview = ({
  image,
  onDelete,
  disabled = false,
}: ImagePreviewProps) => {
  return (
    <Styled.ImagePreviewContainer>
      <img src={image} alt='preview' />
      <Styled.DeleteButton
        onClick={disabled ? undefined : onDelete}
        disabled={disabled}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <img src={delete_button_icon} alt='삭제' />
      </Styled.DeleteButton>
    </Styled.ImagePreviewContainer>
  );
};
