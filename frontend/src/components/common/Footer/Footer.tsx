import React from 'react';
import * as Styled from './Footer.styles';

const Footer = () => {
  return (
    <>
      <Styled.Divider />
      <Styled.FooterContainer>
        <Styled.FooterContent>
          <Styled.PolicyText>개인정보 처리방침</Styled.PolicyText>
          <Styled.CopyRightText>
            Copyright © moodong. All Rights Reserved
          </Styled.CopyRightText>
          <Styled.EmailText>
            e-mail: <a href='mailto:example@example.com'>example@example.com</a>
          </Styled.EmailText>
        </Styled.FooterContent>
      </Styled.FooterContainer>
    </>
  );
};

export default Footer;
