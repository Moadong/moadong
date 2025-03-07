import React from 'react';
import * as Styled from './ClubDetailFooter.styles';
import DeadlineBadge from '@/pages/ClubDetailPage/components/DeadlineBadge/DeadlineBadge';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';

const ClubDetailFooter = () => {
  return (
    <Styled.ClubDetailFooterContainer>
      <DeadlineBadge />
      <ClubApplyButton />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
