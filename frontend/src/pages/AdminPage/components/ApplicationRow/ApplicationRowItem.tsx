import React from 'react';
import Morebutton from '@/assets/images/icons/Morebutton.svg';
import ApplicationMenu from '@/pages/AdminPage/tabs/ApplicationListTab/ApplicationMenu';
import { ApplicationFormItem } from '@/types/application';
import * as Styled from './ApplicationRowItem.style';

interface ApplicationRowItemProps {
  application: ApplicationFormItem;
  isActive: boolean;
  uniqueKeyPrefix: string;
  openMenuId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onToggleStatus: (id: string, status: string) => void;
  onEdit: (id: string) => void;
  onMenuToggle: (e: React.MouseEvent, id: string, prefix: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const ApplicationRowItem = ({
  application,
  isActive,
  uniqueKeyPrefix,
  openMenuId,
  menuRef,
  onToggleStatus,
  onEdit,
  onMenuToggle,
  onDelete,
  className,
}: ApplicationRowItemProps) => {
  const currentMenuKey = `${uniqueKeyPrefix}-${application.id}`; // 더보기 메뉴 한곳에서만 열리도록 고유키 생성
  const isMenuOpen = openMenuId === currentMenuKey;
  // 최종 수정날짜 포맷팅 함수
  const formatDateTime = (dateTimeString: string) => {
    const now = new Date();
    const date = new Date(dateTimeString);
    const isToday =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();

    const options: Intl.DateTimeFormatOptions = isToday
      ? { hour: 'numeric', minute: '2-digit', hour12: true }
      : { year: 'numeric', month: '2-digit', day: '2-digit' };

    return date.toLocaleString('ko-KR', options);
  };

  return (
    <Styled.ApplicationRow className={className} key={application.id}>
      <Styled.ApplicationTitle
        $active={isActive}
        onClick={() => onEdit(application.id)}
      >
        {application.title}
      </Styled.ApplicationTitle>

      <Styled.ApplicationDatetable>
        <Styled.ApplicationDate>
          {formatDateTime(application.editedAt)}
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
              onDelete={() => onDelete(application.id)}
              onToggleStatus={() =>
                onToggleStatus(application.id, application.status)
              }
            />
          )}
        </Styled.MoreButtonContainer>
      </Styled.ApplicationDatetable>
    </Styled.ApplicationRow>
  );
};

export default ApplicationRowItem;
