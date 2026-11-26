// 데스크톱 오른쪽에 따라붙는 지원 카드. 남은 시간·기간·대상·회비·선발과 지원하기를 한곳에 모은다
import {
  formatFee,
  SELECTION_LABEL,
} from '@/pages/ClubDetailPage/components/ClubInsights/ClubInsights';
import {
  DeadlineCountdown,
  RecruitmentSummary,
} from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { RecruitmentStatus } from '@/types/club';
import { ClubFacts } from '@/types/clubInsights';
import * as Styled from './ClubApplyCard.styles';

const DISABLED_LABEL: Partial<Record<RecruitmentStatus, string>> = {
  CLOSED: '모집이 끝났어요',
  UPCOMING: '아직 모집 전이에요',
};

interface ClubApplyCardProps {
  status: RecruitmentStatus;
  recruitment: RecruitmentSummary;
  countdown: DeadlineCountdown;
  recruitmentTarget?: string;
  facts?: ClubFacts;
  onApply: () => void;
}

const ClubApplyCard = ({
  status,
  recruitment,
  countdown,
  recruitmentTarget,
  facts,
  onApply,
}: ClubApplyCardProps) => {
  const rows: { label: string; value: string; note?: string }[] = [];
  if (recruitment.period) {
    rows.push({ label: '모집 기간', value: recruitment.period });
  }
  if (recruitmentTarget?.trim()) {
    rows.push({ label: '지원 대상', value: recruitmentTarget });
  }
  if (facts?.fee) {
    rows.push({
      label: '회비',
      value: `${facts.fee.period === 'SEMESTER' ? '학기' : '입회비'} ${formatFee(facts.fee.amount)}`,
      note: facts.feeNote,
    });
  }
  if (facts?.selection) {
    rows.push({ label: '선발', value: SELECTION_LABEL[facts.selection] });
  }

  const disabledLabel = DISABLED_LABEL[status];

  return (
    <Styled.Card>
      <Styled.Status $status={status}>{recruitment.label}</Styled.Status>
      <Styled.Headline $isUrgent={countdown.isUrgent}>
        {countdown.headline}
      </Styled.Headline>
      {countdown.sub && <Styled.Sub>{countdown.sub}</Styled.Sub>}

      {rows.length > 0 && (
        <Styled.Rows>
          {rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>
                {row.value}
                {row.note && <span>{row.note}</span>}
              </dd>
            </div>
          ))}
        </Styled.Rows>
      )}

      <Styled.ApplyButton
        type='button'
        onClick={onApply}
        disabled={!!disabledLabel}
      >
        {disabledLabel ?? '지원하기'}
      </Styled.ApplyButton>
      {!disabledLabel && (
        <Styled.Hint>지원 방법·일정·지원서 질문을 먼저 보여드려요</Styled.Hint>
      )}
    </Styled.Card>
  );
};

export default ClubApplyCard;
