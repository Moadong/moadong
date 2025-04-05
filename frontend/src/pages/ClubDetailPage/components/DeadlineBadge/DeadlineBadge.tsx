import React, { useMemo } from 'react';
import * as Styled from './DeadlineBadge.styles';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';

interface DeadlineBadgeProps {
  recruitmentPeriod: string;
}

const DeadlineBadge = ({ recruitmentPeriod }: DeadlineBadgeProps) => {
  const { recruitmentStart, recruitmentEnd } = useMemo(() => {
    return parseRecruitmentPeriod(recruitmentPeriod);
  }, [recruitmentPeriod]);

  const today = useMemo(() => new Date(), []);

  const deadlineText = useMemo(() => {
    if (
      recruitmentStart &&
      recruitmentEnd &&
      today >= recruitmentStart &&
      today <= recruitmentEnd
    ) {
      const diffTime = recruitmentEnd.getTime() - today.getTime();
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return days > 0 ? `D-${days}` : 'D-Day';
    }
    return '모집 마감';
  }, [today, recruitmentStart, recruitmentEnd]);

  return (
    <Styled.DeadlineBadgeWrapper>
      <Styled.DeadlineBadgeText>{deadlineText}</Styled.DeadlineBadgeText>
    </Styled.DeadlineBadgeWrapper>
  );
};

export default DeadlineBadge;
