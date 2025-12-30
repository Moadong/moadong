import { useNavigate } from 'react-router-dom';
import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import InstagramIcon from '@/assets/images/icons/sns/instagram_icon.svg';
import YoutubeIcon from '@/assets/images/icons/sns/youtube_icon.svg';
import DefaultCover from '@/assets/images/logos/default_cover_image.png';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import { SNSPlatform } from '@/types/club';
import * as Styled from './ClubProfileCard.styles';

interface Props {
  name: string;
  logo?: string;
  cover?: string;
  recruitmentStatus: string;
  socialLinks: Record<SNSPlatform, string>;
  introDescription: string;
}

const ClubProfileCard = ({
  name,
  logo,
  cover,
  recruitmentStatus,
  socialLinks,
  introDescription,
}: Props) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

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
      {/* 커버 이미지 */}
      <Styled.CoverImageWrapper>
        <Styled.BackButton onClick={handleBackClick} aria-label='뒤로가기'>
          <img src={PrevButton} alt='' />
        </Styled.BackButton>
        <Styled.CoverImage src={cover || DefaultCover} alt='클럽 커버' />
      </Styled.CoverImageWrapper>

      {/* 로고 */}
      <Styled.LogoWrapper>
        <Styled.Logo src={logo || DefaultLogo} alt={`${name} 로고`} />
      </Styled.LogoWrapper>

      {/* 클럽 정보 */}
      <Styled.Content>
        {/* 클럽명 + 뱃지 */}
        <Styled.Header>
          <Styled.ClubName>{name}</Styled.ClubName>
          {recruitmentStatus && <ClubStateBox state={recruitmentStatus} />}
        </Styled.Header>

        {/* SNS 링크들 */}
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
          <Styled.IntroDescription>
            {introDescription}
          </Styled.IntroDescription>
        </Styled.IntroSection>
      </Styled.Content>
    </Styled.Container>
  );
};

export default ClubProfileCard;
