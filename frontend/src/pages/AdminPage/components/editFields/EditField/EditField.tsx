import * as Styled from './EditField.styles';

interface EditFieldProps {
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  labelColor?: string;
}

const EditField = ({
  label,
  children,
  isActive = false,
  labelColor,
}: EditFieldProps) => {
  return (
    <Styled.Card $isActive={isActive}>
      <Styled.Label $color={labelColor}>{label}</Styled.Label>
      {children}
    </Styled.Card>
  );
};

export default EditField;
