// 모집 기간·지원 대상·동아리방·SNS·업데이트 시점을 아이콘 행으로 나열하는 정보 목록
import { ReactNode } from 'react';
import {
  CalendarIcon,
  LinkIcon,
  PeopleIcon,
  PinIcon,
  RefreshIcon,
} from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import {
  getSocialHandle,
  RecruitmentSummary,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import * as Styled from './ClubInfoList.styles';

interface SocialLink {
  platform: 'instagram' | 'youtube';
  url: string;
}

interface ClubInfoListProps {
  recruitment: RecruitmentSummary;
  recruitmentTarget?: string;
  location?: { building: string; detailLocation: string };
  onMapClick?: () => void;
  socialLinks: SocialLink[];
  onSocialClick: (platform: SocialLink['platform'], url: string) => void;
  updatedLabel: string | null;
  /** 데스크톱 오른쪽 카드처럼 테두리 있는 상자로 그린다 */
  variant?: 'plain' | 'card';
}

const PLATFORM_LABEL: Record<SocialLink['platform'], string> = {
  instagram: '인스타그램',
  youtube: '유튜브',
};

const ClubInfoList = ({
  recruitment,
  recruitmentTarget,
  location,
  onMapClick,
  socialLinks,
  onSocialClick,
  updatedLabel,
  variant = 'plain',
}: ClubInfoListProps) => {
  const rows: { key: string; icon: ReactNode; content: ReactNode }[] = [];

  rows.push({
    key: 'period',
    icon: <CalendarIcon />,
    content: (
      <Styled.RowText>
        <Styled.RowLabel>모집</Styled.RowLabel>
        {recruitment.period ?? recruitment.label}
      </Styled.RowText>
    ),
  });

  if (recruitmentTarget?.trim()) {
    rows.push({
      key: 'target',
      icon: <PeopleIcon />,
      content: (
        <Styled.RowText>
          <Styled.RowLabel>대상</Styled.RowLabel>
          {recruitmentTarget}
        </Styled.RowText>
      ),
    });
  }

  if (location) {
    rows.push({
      key: 'location',
      icon: <PinIcon />,
      content: (
        <Styled.RowText>
          <Styled.RowLabel>동아리방</Styled.RowLabel>
          {location.building} {location.detailLocation}
          {onMapClick && (
            <Styled.InlineLink type='button' onClick={onMapClick}>
              지도
            </Styled.InlineLink>
          )}
        </Styled.RowText>
      ),
    });
  }

  if (socialLinks.length > 0) {
    rows.push({
      key: 'sns',
      icon: <LinkIcon />,
      content: (
        <Styled.SocialList>
          {socialLinks.map(({ platform, url }) => (
            <li key={platform}>
              <Styled.SocialLink
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => {
                  e.preventDefault();
                  onSocialClick(platform, url);
                }}
              >
                <Styled.RowLabel>{PLATFORM_LABEL[platform]}</Styled.RowLabel>@
                {getSocialHandle(url)}
              </Styled.SocialLink>
            </li>
          ))}
        </Styled.SocialList>
      ),
    });
  }

  if (updatedLabel) {
    rows.push({
      key: 'updated',
      icon: <RefreshIcon />,
      content: <Styled.MutedText>{updatedLabel}</Styled.MutedText>,
    });
  }

  return (
    <Styled.List $variant={variant}>
      {rows.map((row) => (
        <Styled.Row key={row.key}>
          <Styled.IconBox>{row.icon}</Styled.IconBox>
          {row.content}
        </Styled.Row>
      ))}
    </Styled.List>
  );
};

export default ClubInfoList;
