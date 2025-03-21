import React from 'react';
import * as Styled from './DeadlineBadge.styles';

const DeadlineBadge = () => {
  return (
    // []FIXME: 모집마감 일자 들고와야 함
    <Styled.DeadlineBadgeWrapper>
      <Styled.DeadlineBadgeText>마감</Styled.DeadlineBadgeText>
    </Styled.DeadlineBadgeWrapper>
  );
};

export default DeadlineBadge;
