import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import * as Styled from './Footer.styles';

const Footer = () => {
  const { handleAdminClick } = useHeaderNavigation();

  return (
    <>
      <Styled.FooterContainer>
        <Styled.Divider />
        <Styled.FooterContent>
          <Styled.LeftSection>
            <Styled.PolicyLink to='/privacy-policy'>
              개인정보 처리방침
            </Styled.PolicyLink>
            <Styled.CopyRightText>
              Copyright © moodong. All Rights Reserved
            </Styled.CopyRightText>
            <Styled.EmailText>
              e-mail:{' '}
              <a href='mailto:pknu.moadong@gmail.com'>pknu.moadong@gmail.com</a>
            </Styled.EmailText>
          </Styled.LeftSection>

          <Styled.AdminButton onClick={handleAdminClick}>
            동아리 운영 페이지
          </Styled.AdminButton>
        </Styled.FooterContent>
      </Styled.FooterContainer>
    </>
  );
};

export default Footer;
