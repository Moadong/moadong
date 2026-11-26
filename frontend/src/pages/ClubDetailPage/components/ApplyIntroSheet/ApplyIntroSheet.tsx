// 지원하기를 눌렀을 때 모집 기간·대상·지원 방법·지원 후 과정을 한 번에 보여주고 지원서로 이어주는 시트
import Button from '@/components/common/Button/Button';
import ResponsiveSheet from '@/components/common/ResponsiveSheet/ResponsiveSheet';
import {
  ClubJoinSteps,
  getApplyStep,
} from '@/pages/ClubDetailPage/components/ClubInsights/ClubInsights';
import { ApplyMethod } from '@/pages/ClubDetailPage/hooks/useApplyMethod';
import { RecruitmentSummary } from '@/pages/ClubDetailPage/utils/clubDetailSummary';
import { RecruitmentStatus } from '@/types/club';
import { ClubJoinStep } from '@/types/clubInsights';
import * as Styled from './ApplyIntroSheet.styles';

interface ApplyIntroSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clubName: string;
  recruitmentStatus: RecruitmentStatus;
  recruitment: RecruitmentSummary;
  recruitmentTarget?: string;
  applyMethod?: ApplyMethod;
  afterApplySteps?: ClubJoinStep[];
}

const getConfirmLabel = (method?: ApplyMethod) => {
  switch (method?.kind) {
    case 'EXTERNAL':
      return `${method.platform} 열기`;
    case 'MULTIPLE':
      return '지원서 고르기';
    case 'CONTACT':
      return '확인';
    default:
      return '지원서 작성하기';
  }
};

const ApplyIntroSheet = ({
  isOpen,
  onClose,
  onConfirm,
  clubName,
  recruitmentStatus,
  recruitment,
  recruitmentTarget,
  applyMethod,
  afterApplySteps = [],
}: ApplyIntroSheetProps) => {
  const steps = applyMethod
    ? [getApplyStep(applyMethod, recruitmentStatus), ...afterApplySteps]
    : afterApplySteps;
  // 지원서가 없어 직접 연락해야 하는 동아리는 확인만 누르고 닫는다
  const isContactOnly = applyMethod?.kind === 'CONTACT';

  return (
    <ResponsiveSheet isOpen={isOpen} onClose={onClose}>
      <Styled.Body>
        <Styled.Title>{clubName} 지원 안내</Styled.Title>

        <Styled.InfoList>
          <Styled.InfoRow>
            <dt>모집</dt>
            <dd>
              {recruitment.label}
              {recruitment.detail && <span> · {recruitment.detail}</span>}
            </dd>
          </Styled.InfoRow>
          {recruitment.period && (
            <Styled.InfoRow>
              <dt>기간</dt>
              <dd>{recruitment.period}</dd>
            </Styled.InfoRow>
          )}
          {recruitmentTarget?.trim() && (
            <Styled.InfoRow>
              <dt>대상</dt>
              <dd>{recruitmentTarget}</dd>
            </Styled.InfoRow>
          )}
        </Styled.InfoList>

        {steps.length > 0 && (
          <Styled.StepsBlock>
            <Styled.SubTitle>지원부터 합류까지</Styled.SubTitle>
            <ClubJoinSteps steps={steps} />
          </Styled.StepsBlock>
        )}

        <Button
          width='100%'
          onClick={() => {
            onClose();
            if (!isContactOnly) onConfirm();
          }}
        >
          {getConfirmLabel(applyMethod)}
        </Button>
      </Styled.Body>
    </ResponsiveSheet>
  );
};

export default ApplyIntroSheet;
