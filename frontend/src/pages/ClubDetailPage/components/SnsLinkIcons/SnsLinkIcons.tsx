import React from 'react';
import * as Styled from './SnsLinkIcons.styles';
import { SNS_CONFIG } from '@/constants/snsConfig';

interface SnsLinkIconsProps {
  links: {
    instagram?: string;
    youtube?: string;
    x?: string;
  };
}

const SnsLinkIcons = ({ links }: SnsLinkIconsProps) => {
  return (
    <Styled.SnsIconGroup>
      {links.instagram && (
        <Styled.SnsLink href={links.instagram} target='_blank' rel='noreferrer'>
          <Styled.SnsIcon src={SNS_CONFIG.instagram.icon} alt='instagram' />
        </Styled.SnsLink>
      )}
      {links.youtube && (
        <Styled.SnsLink href={links.youtube} target='_blank' rel='noreferrer'>
          <Styled.SnsIcon src={SNS_CONFIG.youtube.icon} alt='youtube' />
        </Styled.SnsLink>
      )}
      {links.x && (
        <Styled.SnsLink href={links.x} target='_blank' rel='noreferrer'>
          <Styled.SnsIcon src={SNS_CONFIG.x.icon} alt='x' />
        </Styled.SnsLink>
      )}
    </Styled.SnsIconGroup>
  );
};

export default SnsLinkIcons;
