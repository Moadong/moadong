import * as Styled from './EmptyState.styles';

interface EmptyStateProps {
  onCreateForm: () => void;
}

const EmptyState = ({ onCreateForm }: EmptyStateProps) => {
  return (
    <Styled.Container>
      <Styled.Message>모아동 지원서를 등록해주세요</Styled.Message>
      <Styled.CreateButton onClick={onCreateForm}>
        모아동 지원서 만들기
      </Styled.CreateButton>
    </Styled.Container>
  );
};

export default EmptyState;
