import * as Styled from './ApplicantSearchBox.styles';

interface ApplicantSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const ApplicantSearchBox = ({ value, onChange }: ApplicantSearchBoxProps) => {
  return (
    <Styled.Wrapper>
      <Styled.Input
        type='text'
        placeholder='지원자 이름을 검색해주세요'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Styled.SearchIcon />
    </Styled.Wrapper>
  );
};

export default ApplicantSearchBox;
