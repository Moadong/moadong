import React, { useMemo } from 'react';
import * as Styled from './ClubDetailFooter.styles';
import DeadlineBadge from '@/pages/ClubDetailPage/components/DeadlineBadge/DeadlineBadge';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import getDeadlineText from '@/utils/getDeadLineText';

interface ClubDetailFooterProps {
  recruitmentPeriod: string;
  recruitmentForm: string;
  presidentPhoneNumber: string;
}

const ClubDetailFooter = ({
  recruitmentPeriod,
  recruitmentForm,
  presidentPhoneNumber,
}: ClubDetailFooterProps) => {
  const { recruitmentStart, recruitmentEnd } =
    parseRecruitmentPeriod(recruitmentPeriod);

  const today = useMemo(() => new Date(), []);

  const deadlineText = useMemo(() => {
    return getDeadlineText(recruitmentStart, recruitmentEnd, today);
  }, [recruitmentStart, recruitmentEnd, today]);

  return (
    <Styled.ClubDetailFooterContainer>
      <DeadlineBadge deadlineText={deadlineText} />
      <ClubApplyButton
        {...(deadlineText !== '모집 마감' && {
          recruitmentForm,
          presidentPhoneNumber,
        })}
      />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
