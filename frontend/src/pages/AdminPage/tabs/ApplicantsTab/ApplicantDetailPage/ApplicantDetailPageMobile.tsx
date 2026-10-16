import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { AVAILABLE_STATUSES } from '@/constants/status';
import { ApplicantsInfo, ApplicationStatus } from '@/types/applicants';
import { ApplicationFormData, Question } from '@/types/application';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './ApplicantDetailPageMobile.styles';
import AnswerCard from './components/mobile/AnswerCard/AnswerCard';
import ApplicantNavHeader from './components/mobile/ApplicantNavHeader/ApplicantNavHeader';

interface ApplicantDetailPageMobileProps {
  applicantsData: ApplicantsInfo;
  formData: ApplicationFormData;
  applicantIndex: number;
  applicantMemo: string;
  setApplicantMemo: (value: string) => void;
  applicantStatus: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
  onMemoBlur: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (id: string) => void;
  onBack: () => void;
  getAnswerByQuestionId: (qId: number) => string[];
}

const ApplicantDetailPageMobile = ({
  applicantsData,
  formData,
  applicantIndex,
  applicantMemo,
  setApplicantMemo,
  applicantStatus,
  onStatusChange,
  onMemoBlur,
  onPrev,
  onNext,
  onSelect,
  onBack,
  getAnswerByQuestionId,
}: ApplicantDetailPageMobileProps) => {
  const applicantNavItems = applicantsData.applicants.map((a) => ({
    id: a.id,
    name: a.answers[0]?.value ?? '-',
  }));

  return (
    <Styled.Container>
      <WebviewTopBar title='지원서 상세' onBack={onBack} />
      <Styled.Content>
        <Styled.TopSection>
          <ApplicantNavHeader
            applicants={applicantNavItems}
            currentIndex={applicantIndex}
            onPrev={onPrev}
            onNext={onNext}
            onSelect={onSelect}
          />

          <Styled.StatusTabRow>
            {AVAILABLE_STATUSES.map((status) => {
              const { label } = mapStatusToGroup(status);
              return (
                <Styled.StatusTab
                  key={status}
                  $isSelected={applicantStatus === status}
                  onClick={() => onStatusChange(status)}
                >
                  {label}
                </Styled.StatusTab>
              );
            })}
          </Styled.StatusTabRow>

          <Styled.MemoContainer>
            <Styled.MemoLabel>메모</Styled.MemoLabel>
            <Styled.MemoInput
              value={applicantMemo}
              onChange={(e) => setApplicantMemo(e.target.value)}
              onBlur={onMemoBlur}
              placeholder='메모할 내용을 입력해주세요'
            />
          </Styled.MemoContainer>
        </Styled.TopSection>

        <Styled.Divider />

        <Styled.AnswerList>
          {formData.questions?.map((q: Question, i: number) => (
            <AnswerCard
              key={q.id}
              index={i + 1}
              question={q}
              answers={getAnswerByQuestionId(q.id)}
            />
          ))}
        </Styled.AnswerList>
      </Styled.Content>
    </Styled.Container>
  );
};

export default ApplicantDetailPageMobile;
