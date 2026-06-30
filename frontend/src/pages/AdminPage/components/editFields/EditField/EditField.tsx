import * as Styled from './EditField.styles';

interface EditFieldProps {
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const EditField = ({ label, children, isActive = false }: EditFieldProps) => {
  return (
    <Styled.Card $isActive={isActive}>
      <Styled.Label>{label}</Styled.Label>
      {children}
    </Styled.Card>
  );
};

export default EditField;
