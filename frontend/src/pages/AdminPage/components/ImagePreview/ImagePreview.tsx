import React from 'react';
import * as Styled from './ImagePreview.styles';
import { ImagePreviewProps } from '@/types/club';

export const ImagePreview = ({ image, onDelete }: ImagePreviewProps) => {
  return (
    <Styled.ImagePreviewContainer>
      <img src={image} alt='preview' />
      <Styled.DeleteButton onClick={onDelete}>X</Styled.DeleteButton>
    </Styled.ImagePreviewContainer>
  );
};
