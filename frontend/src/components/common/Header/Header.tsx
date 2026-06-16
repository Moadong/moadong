import { useLocation } from 'react-router-dom';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import AdminProfile from '@/components/common/Header/admin/AdminProfile';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useHeaderVisibility from '@/hooks/Header/useHeaderVisibility';
import { useScrollDetection } from '@/hooks/Scroll/useScrollDetection';
import { DeviceType } from '@/types/device';
import * as Styled from './Header.styles';

interface HeaderProps {
  showOn?: DeviceType[];
  hideOn?: DeviceType[];
}

const Header = ({ showOn, hideOn }: HeaderProps) => {
  const location = useLocation();
  const isScrolled = useScrollDetection();
  const isVisible = useHeaderVisibility(showOn, hideOn);
  const {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handlePromotionClick,
  } = useHeaderNavigation();

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminLoginPage = location.pathname.startsWith('/admin/login');

  const navLinks = [
    { label: '모아동 소개', handler: handleIntroduceClick, path: '/introduce' },
    {
      label: '총동아리연합회 소개',
      handler: handleClubUnionClick,
      path: '/club-union',
    },
    {
      label: '홍보•이벤트',
      handler: handlePromotionClick,
      path: '/promotions',
    },
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <Styled.Header isScrolled={isScrolled}>
      <Styled.Container>
        <Styled.LeftSection>
          <Styled.LogoButton onClick={handleHomeClick} aria-label='홈으로 이동'>
            <img
              className='desktop-logo'
              src={DesktopMainIcon}
              alt='모아동 로고'
            />
            <img
              className='mobile-logo'
              src={MobileMainIcon}
              alt='모아동 로고'
            />
          </Styled.LogoButton>
          {!isAdminPage && (
            <Styled.Nav>
              {navLinks.map((link) => (
                <Styled.NavLink
                  key={link.label}
                  $isActive={location.pathname === link.path}
                  onClick={link.handler}
                >
                  {link.label}
                </Styled.NavLink>
              ))}
            </Styled.Nav>
          )}
        </Styled.LeftSection>

        {!isAdminPage && (
          <Styled.SearchArea>
            <SearchBox />
          </Styled.SearchArea>
        )}
        {isAdminPage && !isAdminLoginPage && <AdminProfile />}
      </Styled.Container>
    </Styled.Header>
  );
};

export default Header;
