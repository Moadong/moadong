import React from 'react';
import * as Styled from './ClubLogoEditor.styles';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';

interface ClubLogoEditorProps {
  clubLogo?: string | null;
}

const ClubLogoEditor = ({ clubLogo }: ClubLogoEditorProps) => {
  const displayedClubLogo = clubLogo ?? defaultLogo;

  return (
    <Styled.ClubLogoWrapper>
      <Styled.ClubLogo src={displayedClubLogo} alt='Club Logo' />
    </Styled.ClubLogoWrapper>
  );
};

export default ClubLogoEditor;
