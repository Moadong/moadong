import { ReactNode } from 'react';
import Header from '@/components/common/Header/Header';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './PeaceLayout.styles';

export const PEACE_PAGE_TITLE = '나와 맞는 평화 활동 찾기';

interface PeaceLayoutProps {
  children: ReactNode;
}

const PeaceLayout = ({ children }: PeaceLayoutProps) => {
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();

  return (
    <Styled.PageWrapper>
      {showPageTopBar ? <WebviewTopBar title={PEACE_PAGE_TITLE} /> : <Header />}
      <Styled.Main $topOffset={showPageTopBar ? 0 : HEADER_HEIGHT.desktop}>
        {children}
      </Styled.Main>
    </Styled.PageWrapper>
  );
};

export default PeaceLayout;
