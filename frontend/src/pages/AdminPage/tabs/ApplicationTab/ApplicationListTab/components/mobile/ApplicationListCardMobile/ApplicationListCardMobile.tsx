import type { MouseEvent, RefObject } from 'react';
import MorebuttonIcon from '@/assets/images/icons/ellipsis_icon.svg?react';
import ApplicationMenu from '@/pages/AdminPage/components/ApplicationMenu/ApplicationMenu';
import {
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import { formatApplicationEditedAt } from '@/utils/formatKSTDateTime';
import * as Styled from './ApplicationListCardMobile.styles';

interface ApplicationListCardMobileProps {
  application: ApplicationFormItem;
  isActive: boolean;
  uniqueKeyPrefix: string;
  openMenuId: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggleStatus: (id: string, status: ApplicationFormStatus) => void;
  onEdit: (id: string) => void;
  onMenuToggle: (e: MouseEvent, id: string, prefix: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: () => void;
}

const ApplicationListCardMobile = ({
  application,
  isActive,
  uniqueKeyPrefix,
  openMenuId,
  menuRef,
  onToggleStatus,
  onEdit,
  onMenuToggle,
  onDelete,
  onNavigate,
}: ApplicationListCardMobileProps) => {
  const currentMenuKey = `${uniqueKeyPrefix}-${application.id}`;
  const isMenuOpen = openMenuId === currentMenuKey;
  const year = new Date(application.editedAt).getFullYear();

  return (
    <Styled.Card>
      <Styled.HeaderSection>
        <Styled.YearRow onClick={onNavigate}>
          <Styled.YearText>{year}년도</Styled.YearText>
          <Styled.ChevronIcon />
        </Styled.YearRow>
        <Styled.DividerWrapper>
          <Styled.Divider />
        </Styled.DividerWrapper>
      </Styled.HeaderSection>

      <Styled.ContentSection>
        <Styled.TitleRow>
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
              <ApplicationMenu
                isActive={isActive}
                onToggleStatus={() =>
                  onToggleStatus(application.id, application.status)
                }
                onEdit={() => onEdit(application.id)}
                onDelete={() => onDelete(application.id)}
              />
            )}
          </Styled.MoreButtonContainer>
        </Styled.TitleRow>
        <Styled.DateText>
          {formatApplicationEditedAt(application.editedAt)}
        </Styled.DateText>
      </Styled.ContentSection>
    </Styled.Card>
  );
};

export default ApplicationListCardMobile;
