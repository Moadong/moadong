import CheckSquareIcon from '@/assets/images/icons/check_square_icon.svg?react';
import Delete_applicant from '@/assets/images/icons/Delete_applicant.svg';
import Pencil from '@/assets/images/icons/pencil_icon_3.svg';
import * as Styled from './ApplicationFormContextMenu.styles';

const TOGGLE_TEXT = {
  ACTIVE: '지원서 비활성화',
  INACTIVE: '지원서 활성화',
} as const;

interface ApplicationFormContextMenuProps {
  isActive: boolean;
  onDelete: () => void;
  onToggleStatus?: () => void;
  /** 수정하기 — 모바일에서 편집 페이지로 이동 */
  onEdit?: () => void;
  /** 복제하기 — 데스크탑에서 사용 */
  onDuplicate?: () => void;
}

const ApplicationFormContextMenu = ({
  isActive,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
}: ApplicationFormContextMenuProps) => {
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
        {onEdit && (
          <Styled.MenuItem onClick={onEdit}>
            <Styled.MenuIcon src={Pencil} />
            수정하기
          </Styled.MenuItem>
        )}
        {onDuplicate && (
          <Styled.MenuItem onClick={onDuplicate}>
            <Styled.MenuIcon src={Pencil} />
            지원서 복제하기
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

export default ApplicationFormContextMenu;
