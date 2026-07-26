import CheckSquareIcon from '@/assets/images/icons/check_square_icon.svg?react';
import CopyIcon from '@/assets/images/icons/copy_icon.svg';
import Delete_applicant from '@/assets/images/icons/Delete_applicant.svg';
import Pencil from '@/assets/images/icons/pencil_icon_3.svg';
import * as Styled from './ApplicationMenu.styles';

const TOGGLE_TEXT = {
  ACTIVE: '지원서 비활성화',
  INACTIVE: '지원서 활성화',
} as const;

interface ApplicationMenuProps {
  isActive: boolean;
  onDelete: () => void;
  onToggleStatus?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
}

const ApplicationMenu = ({
  isActive,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
}: ApplicationMenuProps) => {
  const toggleText = isActive ? TOGGLE_TEXT.ACTIVE : TOGGLE_TEXT.INACTIVE;

  return (
    <Styled.MenuContainer>
      <Styled.ToggleMenuItem onClick={onToggleStatus} $active={isActive}>
        <Styled.ToggleIcon $active={isActive}>
          <CheckSquareIcon />
        </Styled.ToggleIcon>
        {toggleText}
      </Styled.ToggleMenuItem>
      <Styled.Separator />
      <Styled.EditDeleteGroup>
        <Styled.MenuItem onClick={onEdit}>
          <Styled.MenuIcon src={Pencil} />
          수정하기
        </Styled.MenuItem>
        <Styled.MenuItem onClick={onDuplicate}>
          <Styled.MenuIcon src={CopyIcon} />
          복제하기
        </Styled.MenuItem>
        <Styled.MenuItem onClick={onDelete} $danger>
          <Styled.MenuIcon src={Delete_applicant} />
          삭제
        </Styled.MenuItem>
      </Styled.EditDeleteGroup>
    </Styled.MenuContainer>
  );
};

export default ApplicationMenu;
