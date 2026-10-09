import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutStudentOAuth } from '@/apis/studentAuth';
import MobileMainIcon from '@/assets/images/logos/moadong_mobile_logo.svg';
import DesktopMainIcon from '@/assets/images/moadong_name_logo.svg';
import AdminProfile from '@/components/common/Header/admin/AdminProfile';
import SearchBox from '@/components/common/SearchBox/SearchBox';
import Toast from '@/components/common/Toast/Toast';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import useHeaderNavigation from '@/hooks/Header/useHeaderNavigation';
import useHeaderVisibility from '@/hooks/Header/useHeaderVisibility';
import { useScrollDetection } from '@/hooks/Scroll/useScrollDetection';
import useDevice from '@/hooks/useDevice';
import { DeviceType } from '@/types/device';
import * as Styled from './Header.styles';

interface HeaderProps {
  showOn?: DeviceType[];
  hideOn?: DeviceType[];
}

const Header = ({ showOn, hideOn }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolled = useScrollDetection();
  const isVisible = useHeaderVisibility(showOn, hideOn);
  const { isMobile, isTablet } = useDevice();
  const {
    handleHomeClick,
    handleIntroduceClick,
    handleClubUnionClick,
    handlePromotionClick,
  } = useHeaderNavigation();

  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(
    () => !!localStorage.getItem(STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN),
  );
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminLoginPage = location.pathname.startsWith('/admin/login');
  const isLoginPage = location.pathname === '/login';
  const isNarrow = isMobile || isTablet;
  const shouldShowHeaderControls = !isAdminPage && !(isNarrow && isLoginPage);

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

  const handleLoginClick = () => navigate('/login');

  const handleLogoutClick = async () => {
    try {
      await logoutStudentOAuth();
    } catch {
      // BE 실패해도 로컬 토큰 제거
    } finally {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN);
      setIsStudentLoggedIn(false);
      setShowLogoutToast(true);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Styled.Header isScrolled={isScrolled}>
        <Styled.Container>
          <Styled.LeftSection>
            <Styled.LogoButton
              onClick={handleHomeClick}
              aria-label='홈으로 이동'
            >
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

          {shouldShowHeaderControls && (
            <Styled.SearchArea>
              <SearchBox />
            </Styled.SearchArea>
          )}
          {shouldShowHeaderControls &&
            (isStudentLoggedIn ? (
              <Styled.AuthButton onClick={handleLogoutClick}>
                로그아웃
              </Styled.AuthButton>
            ) : (
              <Styled.AuthButton
                $isActive={isLoginPage}
                aria-current={isLoginPage ? 'page' : undefined}
                onClick={handleLoginClick}
              >
                로그인
              </Styled.AuthButton>
            ))}
          {isAdminPage && !isAdminLoginPage && <AdminProfile />}
        </Styled.Container>
      </Styled.Header>
      <Toast
        isOpen={showLogoutToast}
        onClose={() => setShowLogoutToast(false)}
        message='로그아웃되었습니다.'
      />
    </>
  );
};

export default Header;
