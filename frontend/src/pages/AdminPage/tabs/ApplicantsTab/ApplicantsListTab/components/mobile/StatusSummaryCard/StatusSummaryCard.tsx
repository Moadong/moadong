import { Fragment } from 'react';
import { ApplicantsInfo } from '@/types/applicants';
import * as Styled from './StatusSummaryCard.styles';

interface StatusSummaryCardProps {
  data: Pick<
    ApplicantsInfo,
    'total' | 'reviewRequired' | 'scheduledInterview' | 'accepted' | 'declined'
  >;
}

const StatusSummaryCard = ({ data }: StatusSummaryCardProps) => {
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
          <Styled.Item>
            <Styled.Label>{label}</Styled.Label>
            <Styled.Count $isTotal={isTotal}>{count ?? 0}</Styled.Count>
          </Styled.Item>
        </Fragment>
      ))}
    </Styled.Card>
  );
};

export default StatusSummaryCard;
