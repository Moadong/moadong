import type { MouseEvent, RefObject } from 'react';
import Morebutton from '@/assets/images/icons/ellipsis_icon.svg';
import ApplicationMenu from '@/pages/AdminPage/components/ApplicationMenu/ApplicationMenu';
import {
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import { formatRelativeDateTime } from '@/utils/formatRelativeDateTime';
import * as Styled from './ApplicationRowItem.style';

interface ApplicationRowItemProps {
  application: ApplicationFormItem;
  isActive: boolean;
  uniqueKeyPrefix: string;
  openMenuId: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggleStatus: (id: string, status: ApplicationFormStatus) => void;
  onNavigate: (id: string) => void;
  onEdit: (id: string) => void;
  onMenuToggle: (e: MouseEvent, id: string, prefix: string) => void;
  onDelete: (id: string) => void;
  // onDuplicate: (id: string) => void; // 추후 복제하기 기능 추가 예정
  className?: string;
}

const ApplicationRowItem = ({
  application,
  isActive,
  uniqueKeyPrefix,
  openMenuId,
  menuRef,
  onToggleStatus,
  onNavigate,
  onEdit,
  onMenuToggle,
  onDelete,
  // onDuplicate,
  className,
}: ApplicationRowItemProps) => {
  const currentMenuKey = `${uniqueKeyPrefix}-${application.id}`;
  const isMenuOpen = openMenuId === currentMenuKey;

  return (
    <Styled.ApplicationRow className={className} key={application.id}>
      <Styled.ApplicationTitle
        $active={isActive}
        onClick={() => onNavigate(application.id)}
      >
        {application.title}
      </Styled.ApplicationTitle>

      <Styled.ApplicationDatetable>
        <Styled.ApplicationDate>
          {formatRelativeDateTime(application.editedAt)}
        </Styled.ApplicationDate>

        <Styled.MoreButtonContainer ref={isMenuOpen ? menuRef : null}>
          <Styled.MoreButton
            onClick={(e) => onMenuToggle(e, application.id, uniqueKeyPrefix)}
          >
            <Styled.MoreButtonIcon src={Morebutton} />
          </Styled.MoreButton>

          {isMenuOpen && (
            <ApplicationMenu
              isActive={isActive}
              onEdit={() => onEdit(application.id)}
              onDelete={() => onDelete(application.id)}
              onToggleStatus={() =>
                onToggleStatus(application.id, application.status)
              }
              // onDuplicate={() => onDuplicate(application.id)}
            />
          )}
        </Styled.MoreButtonContainer>
      </Styled.ApplicationDatetable>
    </Styled.ApplicationRow>
  );
};

export default ApplicationRowItem;
