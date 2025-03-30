import React from 'react';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubTag from '@/components/ClubTag/ClubTag';
import * as Styled from './ClubProfile.styles';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';

interface ClubProfileProps {
  logo?: string;
  name: string;
  category: string;
  division: string;
  tags?: string[];
}

const ClubProfile = ({
  logo,
  name,
  category,
  division,
  tags = [],
}: ClubProfileProps) => {
  return (
    <Styled.ClubContainer>
      {/* todo 기본 로고 적용: 추후 <ClubLogo variant='detail' imageSrc={logo} /> */}
      <ClubLogo variant='detail' imageSrc={defaultLogo || logo} />
      <Styled.ClubInfo>
        <Styled.ClubName>{name}</Styled.ClubName>
        <Styled.TagContainer>
          <ClubTag type={division}>{division}</ClubTag>
          <ClubTag type={category}>{category}</ClubTag>
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
