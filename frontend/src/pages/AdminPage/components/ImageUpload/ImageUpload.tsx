import React, { useRef } from 'react';
import * as Styled from './ImageUpload.styles';
// import UploadAddIcon from '@/assets/images/upload-add.png';
import useCreateFeedImage from '@/hooks/queries/club/useCreateFeedImage';
import { ImageUploadProps } from '@/types/club';
import Button from '@/components/common/Button/Button';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';


export const ImageUpload = ({
  clubId,
  onChangeImageList,
  imageCount,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSuccessUploadImage = (data: string) => {
    onChangeImageList(data);
  };
  const { mutate: createFeedImage } = useCreateFeedImage({
    onSuccess: onSuccessUploadImage,
  });

  const changeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
            alert('선택한 사진 용량이 10MB를 초과합니다.');
            return;
          }
    createFeedImage({ file, clubId });
  };

  return (
    <div>
      {/* <Styled.ImageUploadContainer onClick={() => inputRef.current?.click()}>*/}
      <Styled.ImageUploadInput
        ref={inputRef}
        type='file'
        accept='image/*'
        multiple={false}
        onChange={changeImage}
      />
      <Button
        width={'30%'}
        onClick={() => {
          if (imageCount >= 5) {
            alert('이미지는 최대 5장까지만 업로드할 수 있어요.');
            return;
          }
          inputRef.current?.click();
        }}>
        이미지 업로드
      </Button>
      {/*<img src={UploadAddIcon} alt='Upload Add Icon' />*/}
      {/*</Styled.ImageUploadContainer>*/}
    </div>
  );
};

export default ImageUpload;
