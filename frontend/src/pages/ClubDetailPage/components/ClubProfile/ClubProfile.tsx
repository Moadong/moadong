import React from 'react';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubTag from '@/components/ClubTag/ClubTag';
import * as Styled from './ClubProfile.styles';

interface ClubProfileProps {
  logo?: string;
  name: string;
  classification: string; // 클럽 분류 (예: "중동")
  division: string; // 클럽 분과 (예: "학술")
  tags?: string[];
}

const ClubProfile = ({
  logo,
  name,
  classification,
  division,
  tags = [],
}: ClubProfileProps) => {
  return (
    <Styled.ClubContainer>
      <ClubLogo variant='detail' imageSrc={logo} />
      <Styled.ClubInfo>
        <Styled.ClubName>{name}</Styled.ClubName>
        <Styled.TagContainer>
          <ClubTag type={classification}>{classification}</ClubTag>
          <ClubTag type={division}>{division}</ClubTag>
          {tags.map((tag) => (
            <ClubTag key={tag} type='자유'>
              {tag}
            </ClubTag>
          ))}
        </Styled.TagContainer>
      </Styled.ClubInfo>
    </Styled.ClubContainer>
  );
};

export default ClubProfile;
