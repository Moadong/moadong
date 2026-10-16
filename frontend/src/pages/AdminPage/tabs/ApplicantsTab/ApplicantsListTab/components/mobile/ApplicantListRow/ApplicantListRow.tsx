import { Applicant } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './ApplicantListRow.styles';

interface ApplicantListRowProps {
  applicant: Applicant;
  isChecked: boolean;
  onCheck: (id: string) => void;
  onClick: () => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const ApplicantListRow = ({
  applicant,
  isChecked,
  onCheck,
  onClick,
}: ApplicantListRowProps) => {
  const { label } = mapStatusToGroup(applicant.status);
  const name = applicant.answers[0]?.value ?? '';

  return (
    <Styled.Row onClick={onClick}>
      <Styled.CheckboxWrapper
        onClick={(e) => {
          e.stopPropagation();
          onCheck(applicant.id);
        }}
      >
        <Styled.Checkbox $checked={isChecked} />
      </Styled.CheckboxWrapper>

      <Styled.Info>
        <Styled.Name>{name}</Styled.Name>
        {applicant.memo ? (
          <Styled.Memo>{applicant.memo}</Styled.Memo>
        ) : (
          <Styled.MemoEmpty>메모 없음</Styled.MemoEmpty>
        )}
      </Styled.Info>

      <Styled.Meta>
        <Styled.StatusTag>{label}</Styled.StatusTag>
        <Styled.Date>{formatDate(applicant.createdAt)}</Styled.Date>
      </Styled.Meta>
    </Styled.Row>
  );
};

export default ApplicantListRow;
