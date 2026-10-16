import * as Styled from './EditField.styles';

interface EditFieldProps {
  label: string;
  children: React.ReactNode;
  labelColor?: string;
}

const EditField = ({ label, children, labelColor }: EditFieldProps) => {
  return (
    <Styled.Card>
      <Styled.Label $color={labelColor}>{label}</Styled.Label>
      {children}
    </Styled.Card>
  );
};

export default EditField;
