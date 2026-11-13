import { useLocation } from 'react-router-dom';
import InstagramIcon from '@/assets/images/icons/insta.svg';
import { USER_EVENT } from '@/constants/eventName';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './Footer.styles';

const Footer = () => {
  const { handleAdminClick } = useHeaderNavigation();
  const trackEvent = useMixpanelTrack();
  const { pathname } = useLocation();

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
            <Styled.SnsLink
              href='https://www.instagram.com/_moadong/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() =>
                trackEvent(USER_EVENT.FOOTER_INSTAGRAM_CLICKED, {
                  page: pathname,
                })
              }
            >
              <img src={InstagramIcon} alt='인스타그램' />
              @_moadong
            </Styled.SnsLink>
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
