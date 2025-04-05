import React, { useRef } from 'react';
import * as Styled from './ImageUpload.styles';
import UploadAddIcon from '@/assets/images/upload-add.png';
import useCreateFeedImage from '@/hooks/queries/club/useCreateFeedImage';
import { ImageUploadProps } from '@/types/club';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';

export const ImageUpload = ({
  clubId,
  onChangeImageList,
}: ImageUploadProps) => {
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
      const file = files[0];

      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기가 10MB를 초과합니다.');
        return;
      }

      createFeedImage({ file, clubId });
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
