import RightArrowIcon from '@/assets/images/icons/right_arrow_icon.svg?react';
import EditField from '../EditField/EditField';
import * as Styled from './NavField.styles';

interface NavFieldProps {
  label: string;
  children: React.ReactNode;
  onNavigate: () => void;
}

const NavField = ({ label, children, onNavigate }: NavFieldProps) => {
  return (
    <EditField label={label}>
      <Styled.ContentRow onClick={onNavigate}>
        <Styled.Content>{children}</Styled.Content>
        <RightArrowIcon />
      </Styled.ContentRow>
    </EditField>
  );
};

export default NavField;
