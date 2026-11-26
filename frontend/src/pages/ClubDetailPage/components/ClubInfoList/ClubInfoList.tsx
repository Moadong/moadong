// 모집 기간·지원 대상·동아리방·업데이트 시점을 아이콘 행으로 나열하는 정보 목록 (SNS는 위 바로가기 버튼이 맡는다)
import { ReactNode } from 'react';
import {
  CalendarIcon,
  PeopleIcon,
  PinIcon,
  RefreshIcon,
} from '@/pages/ClubDetailPage/components/ClubDetailIcons/ClubDetailIcons';
import { RecruitmentSummary } from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import * as Styled from './ClubInfoList.styles';

interface ClubInfoListProps {
  recruitment: RecruitmentSummary;
  recruitmentTarget?: string;
  location?: { building: string; detailLocation: string };
  onMapClick?: () => void;
  updatedLabel: string | null;
  /** 데스크톱 오른쪽 카드처럼 테두리 있는 상자로 그린다 */
  variant?: 'plain' | 'card';
}

const ClubInfoList = ({
  recruitment,
  recruitmentTarget,
  location,
  onMapClick,
  updatedLabel,
  variant = 'plain',
}: ClubInfoListProps) => {
  const rows: { key: string; icon: ReactNode; content: ReactNode }[] = [];

  // 모집 상태는 이름 아래 상태 줄이 이미 말하니, 여기엔 실제 기간이 있을 때만 기간을 보탠다
  if (recruitment.period) {
    rows.push({
      key: 'period',
      icon: <CalendarIcon />,
      content: (
        <Styled.RowText>
          <Styled.RowLabel>모집 기간</Styled.RowLabel>
          {recruitment.period}
        </Styled.RowText>
      ),
    });
  }

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
