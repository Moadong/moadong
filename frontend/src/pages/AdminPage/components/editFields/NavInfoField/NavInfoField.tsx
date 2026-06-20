import RightArrowIcon from '@/assets/images/icons/right_arrow_icon.svg?react';
import EditCard from '../EditCard/EditCard';
import * as Styled from './NavInfoField.styles';

interface NavInfoFieldProps {
  label: string;
  children: React.ReactNode;
  onNavigate: () => void;
}

const NavInfoField = ({ label, children, onNavigate }: NavInfoFieldProps) => {
  return (
    <EditCard label={label}>
      <Styled.ContentRow onClick={onNavigate}>
        <Styled.Content>{children}</Styled.Content>
        <RightArrowIcon />
      </Styled.ContentRow>
    </EditCard>
  );
};

export default NavInfoField;
