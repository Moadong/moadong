import { useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './InfoTabs.styles';

const tabLabels = ['모집정보', '동아리정보', '소개글', '활동사진'];

const InfoTabs = ({ onTabClick }: { onTabClick: (index: number) => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const trackEvent = useMixpanelTrack();

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    onTabClick(index);

    trackEvent(USER_EVENT.TAB_CLICKED, {
      tabName: tabLabels[index],
      tabIndex: index,
    });
  };

  return (
    <Styled.InfoTabWrapper isInAppWebView={isInAppWebView()}>
      {tabLabels.map((label, index) => (
        <Styled.InfoTabButton
          key={label}
          className={activeTab === index ? 'active' : ''}
          onClick={() => handleTabClick(index)}
        >
          {label}
        </Styled.InfoTabButton>
      ))}
    </Styled.InfoTabWrapper>
  );
};

export default InfoTabs;
