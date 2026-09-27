import CheckSquareIcon from '@/assets/images/icons/check_square_icon.svg?react';
import CopyIcon from '@/assets/images/icons/copy_icon.svg';
import Delete_applicant from '@/assets/images/icons/Delete_applicant.svg';
import Pencil from '@/assets/images/icons/pencil_icon_3.svg';
import * as Styled from './AdminMoreMenu.styles';

/** 토글 항목은 지원서에서만 쓴다 (onToggleStatus를 넘긴 화면) */
const TOGGLE_TEXT = {
  ACTIVE: '지원서 비활성화',
  INACTIVE: '지원서 활성화',
} as const;

interface AdminMoreMenuProps {
  /** 지원서 활성화 토글용. onToggleStatus를 넘길 때만 쓴다 */
  isActive?: boolean;
  onDelete: () => void;
  onToggleStatus?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
}

const AdminMoreMenu = ({
  isActive = false,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
}: AdminMoreMenuProps) => {
  const toggleText = isActive ? TOGGLE_TEXT.ACTIVE : TOGGLE_TEXT.INACTIVE;

  return (
    <Styled.MenuContainer>
      {onToggleStatus && (
        <>
          <Styled.ToggleMenuItem onClick={onToggleStatus} $active={isActive}>
            <Styled.ToggleIcon $active={isActive}>
              <CheckSquareIcon />
            </Styled.ToggleIcon>
            {toggleText}
          </Styled.ToggleMenuItem>
          <Styled.Separator />
        </>
      )}
      <Styled.EditDeleteGroup>
        {onEdit && (
          <Styled.MenuItem onClick={onEdit}>
            <Styled.MenuIcon src={Pencil} />
            수정하기
          </Styled.MenuItem>
        )}
        {onDuplicate && (
          <Styled.MenuItem onClick={onDuplicate}>
            <Styled.MenuIcon src={CopyIcon} />
            복제하기
          </Styled.MenuItem>
        )}
        <Styled.MenuItem onClick={onDelete} $danger>
          <Styled.MenuIcon src={Delete_applicant} />
          삭제
        </Styled.MenuItem>
      </Styled.EditDeleteGroup>
    </Styled.MenuContainer>
  );
};

export default AdminMoreMenu;
