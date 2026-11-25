// 동아리 이름·한 줄 소개·모집 상태와 바로가기 버튼을 묶은 상세 상단 요약
import { ReactNode } from 'react';
import DefaultLogo from '@/assets/images/logos/default_profile_image.svg';
import {
  CalendarIcon,
  InstagramIcon,
  PinIcon,
  YoutubeIcon,
} from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import {
  getDivisionLabel,
  RecruitmentSummary,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { RecruitmentStatus } from '@/types/club';
import cdnImage, { fallbackToOriginal } from '@/utils/cdnImage';
import * as Styled from './ClubSummary.styles';

interface QuickAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

interface ClubSummaryProps {
  name: string;
  logo?: string;
  category?: string;
  division?: string;
  introduction?: string;
  tags: string[];
  recruitmentStatus: RecruitmentStatus;
  recruitment: RecruitmentSummary;
  instagramUrl?: string;
  youtubeUrl?: string;
  onSocialClick: (platform: 'instagram' | 'youtube', url: string) => void;
  onLocationClick?: () => void;
  onScheduleClick: () => void;
}

const ClubSummary = ({
  name,
  logo,
  category,
  division,
  introduction,
  tags,
  recruitmentStatus,
  recruitment,
  instagramUrl,
  youtubeUrl,
  onSocialClick,
  onLocationClick,
  onScheduleClick,
}: ClubSummaryProps) => {
  const meta = [category, getDivisionLabel(division)].filter(Boolean);
  const visibleTags = tags.filter((tag) => tag.trim());

  const actions: QuickAction[] = [];
  if (instagramUrl) {
    actions.push({
      key: 'instagram',
      label: '인스타그램',
      icon: <InstagramIcon width={22} height={22} />,
      onClick: () => onSocialClick('instagram', instagramUrl),
    });
  }
  if (youtubeUrl) {
    actions.push({
      key: 'youtube',
      label: '유튜브',
      icon: <YoutubeIcon width={22} height={22} />,
      onClick: () => onSocialClick('youtube', youtubeUrl),
    });
  }
  if (onLocationClick) {
    actions.push({
      key: 'location',
      label: '동아리방',
      icon: <PinIcon width={22} height={22} />,
      onClick: onLocationClick,
    });
  }
  actions.push({
    key: 'schedule',
    label: '행사일정',
    icon: <CalendarIcon width={22} height={22} />,
    onClick: onScheduleClick,
  });

  return (
    <Styled.Container>
      <Styled.TitleRow>
        <Styled.Logo
          src={cdnImage(logo || DefaultLogo, 'logo')}
          onError={fallbackToOriginal(logo || DefaultLogo)}
          alt={`${name} 로고`}
        />
        <Styled.TitleText>
          {meta.length > 0 && <Styled.Meta>{meta.join(' · ')}</Styled.Meta>}
          <Styled.Name>{name}</Styled.Name>
        </Styled.TitleText>
      </Styled.TitleRow>

      {introduction?.trim() && <Styled.Intro>{introduction}</Styled.Intro>}

      {visibleTags.length > 0 && (
        <Styled.Tags>
          {visibleTags.map((tag) => (
            <Styled.Tag key={tag}>#{tag}</Styled.Tag>
          ))}
        </Styled.Tags>
      )}

      <Styled.StatusLine $status={recruitmentStatus}>
        <Styled.StatusLabel>{recruitment.label}</Styled.StatusLabel>
        {recruitment.detail && (
          <Styled.StatusDetail $isUrgent={recruitment.isUrgent}>
            {recruitment.detail}
          </Styled.StatusDetail>
        )}
      </Styled.StatusLine>

      <Styled.Actions $count={actions.length}>
        {actions.map((action) => (
          <Styled.ActionButton
            key={action.key}
            type='button'
            onClick={action.onClick}
          >
            <Styled.ActionIcon>{action.icon}</Styled.ActionIcon>
            {action.label}
          </Styled.ActionButton>
        ))}
      </Styled.Actions>
    </Styled.Container>
  );
};

export default ClubSummary;
