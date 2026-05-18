import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import default_profile_image from '@/assets/images/logos/default_profile_image.svg';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import ClubTag from '@/components/ClubTag/ClubTag';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import ClubLogo from '@/pages/MainPage/components/ClubLogo/ClubLogo';
import { Club } from '@/types/club';
import getDeviceType from '@/utils/getDeviceType';
import * as Styled from './ClubCard.styles';

interface ClubCardProps {
  club: Club;
  index?: number;
  page?: string;
  children?: React.ReactNode;
  onCardClick?: (club: Club) => void;
}

const ClubCard = ({
  club,
  index,
  page,
  children,
  onCardClick,
}: ClubCardProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedImpression.current) {
          dwellTimer = setTimeout(() => {
            if (hasTrackedImpression.current) return;
            hasTrackedImpression.current = true;
            const rect = containerRef.current?.getBoundingClientRect();
            mixpanel.track(USER_EVENT.CLUB_CARD_VIEWED, {
              club_id: club.id,
              club_name: club.name,
              recruitment_status: club.recruitmentStatus,
              page,
              scroll_y: Math.round(window.scrollY),
              card_top_in_viewport: rect ? Math.round(rect.top) : undefined,
              dwell_ms: 3000,
              device_type: getDeviceType(),
            });
          }, 3000);
        } else if (dwellTimer) {
          clearTimeout(dwellTimer);
          dwellTimer = null;
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [club.id, club.name, club.recruitmentStatus, page]);

  const handleClick = () => {
    setIsClicked(true);
    trackEvent(USER_EVENT.CLUB_CARD_CLICKED, {
      club_id: club.id,
      club_name: club.name,
      recruitment_status: club.recruitmentStatus,
      page,
      card_index: index,
      scroll_y: Math.round(window.scrollY),
      card_top_in_viewport: rect ? Math.round(rect.top) : undefined,
      device_type: getDeviceType(),
    });

    setTimeout(() => {
      setIsClicked(false);
      if (onCardClick) {
        onCardClick(club);
      } else {
        navigate(`/clubDetail/@${encodeURIComponent(club.name)}`);
      }
    }, 150);
  };

  return (
    <Styled.CardContainer
      ref={containerRef}
      $state={club.recruitmentStatus}
      $isClicked={isClicked}
      onClick={handleClick}
    >
      <Styled.CardHeader>
        <Styled.ClubProfile>
          <ClubLogo $imageSrc={club.logo || default_profile_image} />
          <Styled.ClubInfo>
            <Styled.ClubName>{club.name}</Styled.ClubName>
            <Styled.Introduction>{club.introduction}</Styled.Introduction>
          </Styled.ClubInfo>
        </Styled.ClubProfile>
        {children}
      </Styled.CardHeader>

      <Styled.StateBoxTagContainer>
        <ClubStateBox state={club.recruitmentStatus} />
        <Styled.TagsContainer>
          <ClubTag key={`category-${club.id}`} type={club.category} />
          {club.tags
            .filter((tag) => tag.trim())
            .map((tag) => (
              <ClubTag key={`tag-${club.id}-${tag}`} type={'자유'}>
                {tag}
              </ClubTag>
            ))}
        </Styled.TagsContainer>
      </Styled.StateBoxTagContainer>
    </Styled.CardContainer>
  );
};

export default ClubCard;
