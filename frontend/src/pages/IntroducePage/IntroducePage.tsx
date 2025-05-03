import React from 'react';
import * as Styled from './IntroducePage.styles';
import Header from '@/components/common/Header/Header';
import IntroduceImage from '@/assets/images/Introduce.png';

const IntroducePage = () => {
  return (
    <>
      <Header />
      <Styled.IntroduceImage src={IntroduceImage} alt='소개 이미지' />
    </>
  );
};

export default IntroducePage;
