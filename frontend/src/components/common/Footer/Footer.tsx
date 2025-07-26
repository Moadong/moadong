import * as Styled from './Footer.styles';

const Footer = () => {
  return (
    <>
      <Styled.FooterContainer>
        <Styled.Divider />
        <Styled.FooterContent>
                  <Styled.PolicyLink
          href='https://honorable-cough-8f9.notion.site/232aad23209680f2a2cadb146eff81cd?pvs=74'
          target='_blank'
          rel='noopener noreferrer'
        >
          개인정보 처리방침
        </Styled.PolicyLink>
          <Styled.CopyRightText>
            Copyright © moodong. All Rights Reserved
          </Styled.CopyRightText>
          <Styled.EmailText>
            e-mail:{' '}
            <a href='mailto:pknu.moadong@gmail.com'>pknu.moadong@gmail.com</a>
          </Styled.EmailText>
        </Styled.FooterContent>
      </Styled.FooterContainer>
    </>
  );
};

export default Footer;
