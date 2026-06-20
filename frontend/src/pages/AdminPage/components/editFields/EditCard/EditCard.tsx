import * as Styled from './EditCard.styles';

interface EditCardProps {
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const EditCard = ({ label, children, isActive = false }: EditCardProps) => {
  return (
    <Styled.Card $isActive={isActive}>
      <Styled.Label>{label}</Styled.Label>
      {children}
    </Styled.Card>
  );
};

export default EditCard;
