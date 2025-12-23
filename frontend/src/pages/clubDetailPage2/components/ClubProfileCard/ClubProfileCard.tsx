import { SNSPlatform } from '@/types/club';
import * as Styled from './ClubProfileCard.styles';
import InstagramIcon from '@/assets/images/icons/sns/instagram_icon.svg';
import YoutubeIcon from '@/assets/images/icons/sns/youtube_icon.svg';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';


interface Props {
  name: string;
  logo: string;
  cover: string;
  recruitmentStatus: string;
  socialLinks: Record<SNSPlatform, string>;
  activityDescription: string;
}

const ClubProfileCard = ({
  name,
  logo,
  cover,
  recruitmentStatus,
  socialLinks,
  activityDescription,
}: Props) => {
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
      <Styled.CoverImage src={cover || '/default-cover.jpg'} alt="클럽 커버" />

      {/* 로고 */}
      <Styled.LogoWrapper>
        <Styled.Logo src={logo || '/default-logo.jpg'} alt={`${name} 로고`} />
      </Styled.LogoWrapper>

      {/* 클럽 정보 */}
      <Styled.Content>
        {/* 클럽명 + 뱃지 */}
        <Styled.Header>
          <Styled.ClubName>{name}</Styled.ClubName>
          {recruitmentStatus && (
            <ClubStateBox state={recruitmentStatus} />
          )}
        </Styled.Header>

        {/* SNS 링크들 */}
        <Styled.SocialLinksWrapper>
          {getActiveSocials().map(({ platform, url }) => {
            const icon = getSocialIcon(platform);
            if (!icon) return null;
            
            const cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
            
            return (
              <Styled.SocialLinkItem
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Styled.SocialIcon src={icon} alt={platform} />
                <Styled.SocialText>
                  {name} {getSocialPlatformName(platform)}{' '}
                  <Styled.SocialUrl>{cleanUrl}</Styled.SocialUrl>
                </Styled.SocialText>
              </Styled.SocialLinkItem>
            );
          })}
        </Styled.SocialLinksWrapper>

        {/* 소개 섹션 */}
        <Styled.IntroSection>
          <Styled.IntroTitle>{name}를 소개할게요</Styled.IntroTitle>
          <Styled.IntroDescription>{activityDescription}</Styled.IntroDescription>
        </Styled.IntroSection>
      </Styled.Content>
    </Styled.Container>
  );
}

export default ClubProfileCard;