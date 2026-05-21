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

const COOLDOWN_MS = 2_000; // IntersectionObserver jitter 방지
const IMPRESSION_THRESHOLD = 0.5; // IAB 뷰어빌리티 기준 (50% in-view)

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

  const SS_LAST_KEY = `clubcard_last_${page ?? 'default'}_${club.id}`;
  const SS_COUNT_KEY = `clubcard_count_${page ?? 'default'}_${club.id}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let intersectStart: number | null = null;
    let capturedTop: number | null = null;
    let capturedScrollY: number | null = null;

    const fireImpressionEvent = () => {
      if (intersectStart === null) return;
      const dwell_ms = Date.now() - intersectStart;
      const count =
        parseInt(sessionStorage.getItem(SS_COUNT_KEY) ?? '0', 10) + 1;
      sessionStorage.setItem(SS_LAST_KEY, String(Date.now()));
      sessionStorage.setItem(SS_COUNT_KEY, String(count));
      trackEvent(USER_EVENT.CLUB_CARD_VIEWED, {
        club_id: club.id,
        club_name: club.name,
        recruitment_status: club.recruitmentStatus,
        page,
        scroll_y: capturedScrollY,
        card_top_in_viewport: capturedTop,
        dwell_ms,
        view_count: count,
        reentry_count: Math.max(0, count - 1),
        device_type: getDeviceType(),
      });
      intersectStart = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') fireImpressionEvent();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const lastTime = parseInt(
            sessionStorage.getItem(SS_LAST_KEY) ?? '0',
            10,
          );
          if (Date.now() - lastTime < COOLDOWN_MS) return;
          intersectStart = Date.now();
          capturedTop = Math.round(entry.boundingClientRect.top);
          capturedScrollY = Math.round(window.scrollY);
        } else {
          fireImpressionEvent();
        }
      },
      { threshold: IMPRESSION_THRESHOLD },
    );

    observer.observe(el);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      fireImpressionEvent();
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
      card_top_in_viewport: (() => {
        const rect = containerRef.current?.getBoundingClientRect();
        return rect ? Math.round(rect.top) : undefined;
      })(),
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
