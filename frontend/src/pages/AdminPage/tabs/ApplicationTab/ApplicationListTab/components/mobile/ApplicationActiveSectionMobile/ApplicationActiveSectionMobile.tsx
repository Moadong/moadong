import type { MouseEvent, RefObject } from 'react';
import {
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import ApplicationCardMobile from '../ApplicationCardMobile/ApplicationCardMobile';
import * as Styled from './ApplicationActiveSectionMobile.styles';

interface ApplicationActiveSectionMobileProps {
  activeForms: ApplicationFormItem[];
  openMenuId: string | null;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggleStatus: (id: string, status: ApplicationFormStatus) => void;
  onEdit: (id: string) => void;
  onMenuToggle: (e: MouseEvent, id: string, prefix: string) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

const ApplicationActiveSectionMobile = ({
  activeForms,
  openMenuId,
  menuRef,
  onToggleStatus,
  onEdit,
  onMenuToggle,
  onDelete,
  onDuplicate,
}: ApplicationActiveSectionMobileProps) => {
  if (activeForms.length === 0) {
    return (
      <Styled.EmptyBox>
        <Styled.EmptyTitle>활성화된 지원서 없음</Styled.EmptyTitle>
        <Styled.EmptyDescription>
          지원서 카드 우측 메뉴에서 지원서 활성화를 선택해 보세요.
        </Styled.EmptyDescription>
      </Styled.EmptyBox>
    );
  }

  return (
    <Styled.CardList>
      {activeForms.map((form) => (
        <ApplicationCardMobile
          key={form.id}
          application={form}
          isActive={true}
          uniqueKeyPrefix='active'
          openMenuId={openMenuId}
          menuRef={menuRef}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onMenuToggle={onMenuToggle}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </Styled.CardList>
  );
};

export default ApplicationActiveSectionMobile;
