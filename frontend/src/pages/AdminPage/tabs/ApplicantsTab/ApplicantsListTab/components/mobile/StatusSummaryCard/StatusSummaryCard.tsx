import { Fragment } from 'react';
import { ApplicantsInfo } from '@/types/applicants';
import * as Styled from './StatusSummaryCard.styles';

interface StatusSummaryCardProps {
  data: Pick<
    ApplicantsInfo,
    'total' | 'reviewRequired' | 'scheduledInterview' | 'accepted' | 'declined'
  >;
  /**
   * 항목을 카드 폭에 고르게 나눠 채운다. 관리자 모바일 시안은 50px 항목을 양 끝에 붙이지만,
   * 넓은 카드(소개 페이지 운영진 미리보기)에서는 양 끝에 붙으면 가운데가 비어 보여서 쓴다.
   */
  spread?: boolean;
}

const StatusSummaryCard = ({
  data,
  spread = false,
}: StatusSummaryCardProps) => {
  const items = [
    { label: '전체', count: data.total, isTotal: true },
    { label: '검토 전', count: data.reviewRequired, isTotal: false },
    { label: '면접예정', count: data.scheduledInterview, isTotal: false },
    { label: '합격', count: data.accepted, isTotal: false },
    { label: '불합격', count: data.declined, isTotal: false },
  ];

  return (
    <Styled.Card>
      {items.map(({ label, count, isTotal }, index) => (
        <Fragment key={label}>
          {index > 0 && <Styled.Divider />}
          <Styled.Item $spread={spread}>
            <Styled.Label>{label}</Styled.Label>
            <Styled.Count $isTotal={isTotal}>{count ?? 0}</Styled.Count>
          </Styled.Item>
        </Fragment>
      ))}
    </Styled.Card>
  );
};

export default StatusSummaryCard;
