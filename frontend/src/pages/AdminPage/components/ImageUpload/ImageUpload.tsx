import React, { useRef } from 'react';
import * as Styled from './ImageUpload.styles';
import UploadAddIcon from '@/assets/images/upload-add.png';
import useCreateFeedImage from '@/hooks/queries/club/useCreateFeedImage';

export const ImageUpload = ({
  clubId,
  onChangeImageList,
}: {
  clubId: string;
  onChangeImageList: (image: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSuccessUploadImage = (data: string) => {
    onChangeImageList(data);
  };
  const { mutate: createFeedImage } = useCreateFeedImage({
    onSuccess: onSuccessUploadImage,
  });

  const changeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      createFeedImage({ file: files[0], clubId });
    }
  };

  return (
    <Styled.ImageUploadContainer onClick={() => inputRef.current?.click()}>
      <Styled.ImageUploadInput
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={changeImage}
      />
      <img src={UploadAddIcon} alt='Upload Add Icon' />
    </Styled.ImageUploadContainer>
  );
};

export default ImageUpload;