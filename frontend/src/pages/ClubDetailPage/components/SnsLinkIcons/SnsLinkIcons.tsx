import React from 'react';
import * as Styled from './SnsLinkIcons.styles';
import { SNS_CONFIG } from '@/constants/snsConfig';
import { SNSPlatform } from '@/types/club';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { USER_EVENT } from '@/constants/eventName';

interface SnsLinkIconsProps {
  apiSocialLinks: Partial<Record<SNSPlatform, string>>;
  clubName?: string;
}

const SnsLinkIcons = ({ apiSocialLinks, clubName }: SnsLinkIconsProps) => {
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
            onClick={() =>
              trackEvent(USER_EVENT.SNS_LINK_CLICKED, {
                platform,
                clubName,
              })
            }
          >
            <Styled.SnsIcon src={config.icon} alt={config.label} />
          </Styled.SnsLink>
        );
      })}
    </Styled.SnsIconGroup>
  );
};

export default SnsLinkIcons;
