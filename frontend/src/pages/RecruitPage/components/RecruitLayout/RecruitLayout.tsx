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
  /** 이전 화면이 없을 때 상단바 뒤로가기가 보낼 경로. 없으면 '/' */
  backFallbackPath?: string;
  /** 하단 고정 버튼(FixedBottomButtonArea)이 있으면 그만큼 아래 여백을 둔다 */
  hasFixedBottomButton?: boolean;
}

const RecruitLayout = ({
  children,
  backFallbackPath,
  hasFixedBottomButton = false,
}: RecruitLayoutProps) => {
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();

  return (
    <Styled.PageWrapper $hasFixedBottomButton={hasFixedBottomButton}>
      {showPageTopBar ? (
        <WebviewTopBar
          title={RECRUIT_PAGE_TITLE}
          fallbackPath={backFallbackPath}
        />
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
