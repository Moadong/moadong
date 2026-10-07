import { ReactNode } from 'react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import { RECRUIT_PAGE_TITLE } from '../../constants/recruit';
import * as Styled from './RecruitLayout.styles';

interface RecruitLayoutProps {
  children: ReactNode;
}

const RecruitLayout = ({ children }: RecruitLayoutProps) => {
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();

  return (
    <Styled.PageWrapper>
      {showPageTopBar ? (
        <WebviewTopBar title={RECRUIT_PAGE_TITLE} />
      ) : (
        <Header />
      )}
      <Styled.Main $topOffset={showPageTopBar ? 0 : HEADER_HEIGHT.desktop}>
        {children}
      </Styled.Main>
      {!isInAppWebView() && <Footer />}
    </Styled.PageWrapper>
  );
};

export default RecruitLayout;
