import type { MouseEvent, RefObject } from 'react';
import MorebuttonIcon from '@/assets/images/icons/ellipsis_icon.svg?react';
import ApplicationFormContextMenu from '@/pages/AdminPage/components/ApplicationFormContextMenu/ApplicationFormContextMenu';
import {
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import { formatApplicationEditedAt } from '@/utils/formatKSTDateTime';
import * as Styled from './ApplicationCardMobile.styles';

interface ApplicationCardMobileProps {
  application: ApplicationFormItem;
  isActive: boolean;
  uniqueKeyPrefix: string;
  openMenuId: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggleStatus: (id: string, status: ApplicationFormStatus) => void;
  onEdit: (id: string) => void;
  onMenuToggle: (e: MouseEvent, id: string, prefix: string) => void;
  onDelete: (id: string) => void;
}

const ApplicationCardMobile = ({
  application,
  isActive,
  uniqueKeyPrefix,
  openMenuId,
  menuRef,
  onToggleStatus,
  onEdit,
  onMenuToggle,
  onDelete,
}: ApplicationCardMobileProps) => {
  const currentMenuKey = `${uniqueKeyPrefix}-${application.id}`;
  const isMenuOpen = openMenuId === currentMenuKey;

  return (
    <Styled.Card>
      <Styled.TopRow>
        <Styled.TitleArea>
          {isActive && <Styled.ActiveDot />}
          <Styled.Title $active={isActive}>{application.title}</Styled.Title>
        </Styled.TitleArea>

        <Styled.MoreButtonContainer ref={isMenuOpen ? menuRef : null}>
          <Styled.MoreButton
            onClick={(e) => onMenuToggle(e, application.id, uniqueKeyPrefix)}
          >
            <MorebuttonIcon />
          </Styled.MoreButton>

          {isMenuOpen && (
            <ApplicationFormContextMenu
              isActive={isActive}
              onToggleStatus={() =>
                onToggleStatus(application.id, application.status)
              }
              onEdit={() => onEdit(application.id)}
              onDelete={() => onDelete(application.id)}
            />
          )}
        </Styled.MoreButtonContainer>
      </Styled.TopRow>

      <Styled.DateText>
        {formatApplicationEditedAt(application.editedAt)}
      </Styled.DateText>
    </Styled.Card>
  );
};

export default ApplicationCardMobile;
