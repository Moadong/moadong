import React from 'react';
import * as Styled from './ImagePreview.styles';
import { ImagePreviewProps } from '@/types/club';
import delete_button_icon from '@/assets/images/icons/delete_button_icon.svg';

export const ImagePreview = ({ image, onDelete }: ImagePreviewProps) => {
  return (
    <Styled.ImagePreviewContainer>
      <img src={image} alt='preview' />
      <Styled.DeleteButton onClick={onDelete}>
        <img src={delete_button_icon} alt='삭제' />
      </Styled.DeleteButton>
    </Styled.ImagePreviewContainer>
  );
};
