import React, { useState } from 'react';
import * as Styled from './IntroducePage.styles';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import Spinner from '@/components/common/Spinner/Spinner';
import IntroduceImage from '@/assets/images/introduce/Introduce.png';

const IntroducePage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Styled.IntroducePageHeader>
        <Header />
      </Styled.IntroducePageHeader>
      {loading && <Spinner height='800px' />}
      <Styled.IntroduceImage
        src={IntroduceImage}
        alt='소개 이미지'
        style={{ display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
      />
      <Styled.IntroducePageFooter>
        <Footer />
      </Styled.IntroducePageFooter>
    </>
  );
};

export default IntroducePage;
