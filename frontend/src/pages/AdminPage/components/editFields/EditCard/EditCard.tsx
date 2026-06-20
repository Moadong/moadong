import * as Styled from './EditCard.styles';

interface EditCardProps {
  label: string;
  children: React.ReactNode;
}

const EditCard = ({ label, children }: EditCardProps) => {
  return (
    <Styled.Card>
      <Styled.Label>{label}</Styled.Label>
      {children}
    </Styled.Card>
  );
};

export default EditCard;
