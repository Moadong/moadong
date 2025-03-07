import React from 'react';
import * as Styled from './ClubDetailHeader.styles';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';

interface ClubDetailHeaderProps {
  name: string;
  classification: string;
  division: string;
  tags: string[];
}

const ClubDetailHeader = ({
  name,
  classification,
  division,
  tags,
}: ClubDetailHeaderProps) => {
  return (
    <Styled.ClubDetailHeaderContainer>
      <ClubProfile
        name={name}
        classification={classification}
        division={division}
        tags={tags}
      />
      <ClubApplyButton />
    </Styled.ClubDetailHeaderContainer>
  );
};

export default ClubDetailHeader;
