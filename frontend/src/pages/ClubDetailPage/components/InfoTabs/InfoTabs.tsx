import React, { useState } from 'react';
import * as Styled from './InfoTabs.styles';

const tabLabels = ['모집정보', '동아리정보', '소개글', '활동사진'];

const InfoTabs = ({ onTabClick }: { onTabClick: (index: number) => void }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    onTabClick(index);
  };

  return (
    <Styled.InfoTabWrapper>
      {tabLabels.map((label, index) => (
        <Styled.InfoTabButton
          key={label}
          className={activeTab === index ? 'active' : ''}
          onClick={() => handleTabClick(index)}>
          {label}
        </Styled.InfoTabButton>
      ))}
    </Styled.InfoTabWrapper>
  );
};

export default InfoTabs;
