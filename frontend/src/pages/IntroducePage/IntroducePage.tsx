import React, { useState } from 'react';
import * as Styled from './IntroducePage.styles';
import Header from '@/components/common/Header/Header';
import Spinner from '@/components/common/Spinner/Spinner';
import IntroduceImage from '@/assets/images/Introduce.png';

const IntroducePage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Styled.IntroducePageHeader>
        <Header />
      </Styled.IntroducePageHeader>
      {loading && <Spinner />}
      <Styled.IntroduceImage
        src={IntroduceImage}
        alt='소개 이미지'
        style={{ display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
      />
    </>
  );
};

export default IntroducePage;
