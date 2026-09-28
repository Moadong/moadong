import { ReactNode } from 'react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './PeaceLayout.styles';

export const PEACE_PAGE_TITLE = '나와 맞는 평화 활동 찾기';

interface PeaceLayoutProps {
  children: ReactNode;
  /** 부스 태블릿 모드. 헤더·탑바·푸터 없이 본문만 보여준다 */
  kiosk?: boolean;
}

const PeaceLayout = ({ children, kiosk = false }: PeaceLayoutProps) => {
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();
  const showHeader = !kiosk && !showPageTopBar;

  return (
    <Styled.PageWrapper>
      {!kiosk &&
        (showPageTopBar ? (
          <WebviewTopBar title={PEACE_PAGE_TITLE} />
        ) : (
          <Header />
        ))}
      <Styled.Main $topOffset={showHeader ? HEADER_HEIGHT.desktop : 0}>
        {children}
      </Styled.Main>
      {!kiosk && !isInAppWebView() && <Footer />}
    </Styled.PageWrapper>
  );
};

export default PeaceLayout;
