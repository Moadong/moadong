import { Link } from 'react-router-dom';
import useNavigator from '@/hooks/useNavigator';
import locationIcon from '@/assets/images/icons/location_icon.svg';
import InstagramIcon from '@/assets/images/icons/sns/instagram_icon.svg';
import YoutubeIcon from '@/assets/images/icons/sns/youtube_icon.svg';
import DefaultCover from '@/assets/images/logos/default_cover_image.png';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import { ClubLocation } from '@/constants/clubLocation';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { SNSPlatform } from '@/types/club';
import * as Styled from './ClubProfileCard.styles';

interface ClubProfileCardProps {
  name: string;
  logo?: string;
  cover?: string;
  recruitmentStatus: string;
  socialLinks: Record<SNSPlatform, string>;
  introDescription: string;
  location?: Pick<ClubLocation, 'building' | 'detailLocation'>;
  mapPath?: string;
}

const ClubProfileCard = ({
  name,
  logo,
  cover,
  recruitmentStatus,
  socialLinks,
  introDescription,
  location,
  mapPath,
}: ClubProfileCardProps) => {
  const trackEvent = useMixpanelTrack();
  const handleLink = useNavigator();

  const getSocialPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      instagram: '인스타그램',
      youtube: '유튜브',
      x: 'X',
    };
    return names[platform] || platform;
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: InstagramIcon,
      youtube: YoutubeIcon,
    };
    return icons[platform];
  };

  const getActiveSocials = () => {
    return Object.entries(socialLinks)
      .filter(([_, url]) => url)
      .map(([platform, url]) => ({ platform, url }));
  };

  return (
    <Styled.Container>
      <Styled.CoverImageWrapper>
        <Styled.CoverImage src={cover || DefaultCover} alt='클럽 커버' />
      </Styled.CoverImageWrapper>

      <Styled.LogoWrapper>
        <Styled.Logo src={logo || DefaultLogo} alt={`${name} 로고`} />
      </Styled.LogoWrapper>

      <Styled.Content>
        <Styled.Header>
          <Styled.ClubName>{name}</Styled.ClubName>
          {recruitmentStatus && <ClubStateBox state={recruitmentStatus} />}
        </Styled.Header>

        <Styled.SocialLinksWrapper>
          {getActiveSocials().map(({ platform, url }) => {
            const icon = getSocialIcon(platform);
            if (!icon) return null;

            const username = (() => {
              const lastSegment = url.split('/').filter(Boolean).pop() || '';
              return lastSegment.split('?')[0].split('#')[0];
            })();
            const displayName = `@${username}`;

            return (
              <Styled.SocialLinkItem
                key={platform}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent(USER_EVENT.SNS_LINK_CLICKED, {
                    platform,
                    clubName: name,
                  });
                  handleLink(url);
                }}
              >
                <Styled.SocialIcon src={icon} alt={platform} />
                <Styled.SocialText>
                  {name} {getSocialPlatformName(platform)}{' '}
                  <Styled.SocialUrl>{displayName}</Styled.SocialUrl>
                </Styled.SocialText>
              </Styled.SocialLinkItem>
            );
          })}
        </Styled.SocialLinksWrapper>

        {/* 소개 섹션 */}
        <Styled.IntroSection>
          <Styled.IntroTitle>{name}를 소개할게요</Styled.IntroTitle>
          <Styled.IntroDescription>{introDescription}</Styled.IntroDescription>
          {location && mapPath && (
            <Styled.MobileLocationSection>
              <Styled.LocationDivider />
              <Styled.LocationRow>
                <Styled.LocationInfo>
                  <img src={locationIcon} alt='위치 아이콘' />
                  <span>
                    동아리방 위치 {location.building} {location.detailLocation}
                  </span>
                </Styled.LocationInfo>
                <Styled.LocationDot>·</Styled.LocationDot>
                <Styled.MapLink as={Link} to={mapPath}>
                  지도
                </Styled.MapLink>
              </Styled.LocationRow>
            </Styled.MobileLocationSection>
          )}
        </Styled.IntroSection>
      </Styled.Content>
    </Styled.Container>
  );
};

export default ClubProfileCard;
