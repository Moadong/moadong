import React from 'react';
import * as Styled from './SnsLinkIcons.styles';
import { SNS_CONFIG } from '@/constants/snsConfig';
import { SNSPlatform } from '@/types/club';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';

interface SnsLinkIconsProps {
  apiSocialLinks: Partial<Record<SNSPlatform, string>>;
}

const SnsLinkIcons = ({ apiSocialLinks }: SnsLinkIconsProps) => {
  const trackEvent = useMixpanelTrack();

  if (!apiSocialLinks) return null;
  return (
    <Styled.SnsIconGroup>
      {Object.entries(apiSocialLinks).map(([platform, url]) => {
        if (!url) return null;

        const config = SNS_CONFIG[platform as SNSPlatform];
        return (
          <Styled.SnsLink
            key={platform}
            href={url}
            target='_blank'
            rel='noreferrer'
          >
            <Styled.SnsIcon
              src={config.icon}
              alt={config.label}
              onClick={() => trackEvent('sns링크 버튼 클릭', { platform })}
            />
          </Styled.SnsLink>
        );
      })}
    </Styled.SnsIconGroup>
  );
};

export default SnsLinkIcons;
