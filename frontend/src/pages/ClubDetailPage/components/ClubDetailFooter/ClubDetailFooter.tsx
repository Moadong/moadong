import React from 'react';
import * as Styled from './ClubDetailFooter.styles';
import DeadlineBadge from '@/pages/ClubDetailPage/components/DeadlineBadge/DeadlineBadge';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';

interface ClubDetailFooterProps {
  recruitmentPeriod: string;
}

const ClubDetailFooter = ({ recruitmentPeriod }: ClubDetailFooterProps) => {
  return (
    <Styled.ClubDetailFooterContainer>
      <DeadlineBadge recruitmentPeriod={recruitmentPeriod} />
      <ClubApplyButton />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
