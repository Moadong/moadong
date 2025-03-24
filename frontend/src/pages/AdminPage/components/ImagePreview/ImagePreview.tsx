import React from 'react';
import * as Styled from './ImagePreview.styles';

export const ImagePreview = ({
  image,
  onDelete,
}: {
  image: string;
  onDelete: () => void;
}) => {
  return (
    <Styled.ImagePreviewContainer>
      <img src={image} alt='preview' />
      <Styled.DeleteButton onClick={onDelete}>X</Styled.DeleteButton>
    </Styled.ImagePreviewContainer>
  );
};