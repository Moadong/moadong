import { useEffect, useRef, useState } from 'react';
import SortByCreatedIcon from '@/assets/images/icons/sort_desc_icon.svg?react';
import SortByEditedIcon from '@/assets/images/icons/sort_asc_icon.svg?react';
import addLargeIcon from '@/assets/images/icons/add_large_icon.svg';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { SCROLL_TRIGGER_DISABLED } from '@/hooks/Scroll/useScrollTrigger';
import MobileFloatingButton from '@/pages/AdminPage/components/MobileFloatingButton/MobileFloatingButton';
import {
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import { formatApplicationEditedAt } from '@/utils/formatKSTDateTime';
import ApplicationCardMobile from '../ApplicationCardMobile/ApplicationCardMobile';
import * as Styled from './ApplicationYearDetailPage.styles';

type SortType = 'created' | 'edited';

interface ApplicationYearDetailPageProps {
  year: number;
  forms: ApplicationFormItem[];
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleStatus: (id: string, status: ApplicationFormStatus) => void;
  onCreateNew: () => void;
}

const ApplicationYearDetailPage = ({
  year,
  forms,
  onBack,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onCreateNew,
}: ApplicationYearDetailPageProps) => {
  const [sortType, setSortType] = useState<SortType>('created');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.dataset[SCROLL_TRIGGER_DISABLED] = 'true';
    window.dispatchEvent(new Event('scroll'));
    return () => {
      delete document.body.dataset[SCROLL_TRIGGER_DISABLED];
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [openMenuId]);

  const handleMenuToggle = (
    e: React.MouseEvent,
    id: string,
    prefix: string,
  ) => {
    e.stopPropagation();
    const key = `${prefix}-${id}`;
    setOpenMenuId((prev) => (prev === key ? null : key));
  };

  const sortedForms =
    sortType === 'created'
      ? [...forms].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
      : [...forms].sort(
          (a, b) =>
            new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime(),
        );

  const isCreated = sortType === 'created';

  return (
    <>
    <Styled.Container>
      <WebviewTopBar title={`${year}년도`} onBack={onBack} />
      <Styled.Content>
        <Styled.SortRow>
          <Styled.SortButton
            type='button'
            onClick={() => setSortType(isCreated ? 'edited' : 'created')}
          >
            {isCreated ? <SortByCreatedIcon /> : <SortByEditedIcon />}
            <Styled.SortText>
              {isCreated ? '최근 생성순' : '최근 수정순'}
            </Styled.SortText>
          </Styled.SortButton>
        </Styled.SortRow>

        <Styled.CardList>
          {sortedForms.map((form) => (
            <ApplicationCardMobile
              key={form.id}
              application={form}
              isActive={form.status === 'ACTIVE'}
              uniqueKeyPrefix={`year-detail-${year}`}
              openMenuId={openMenuId}
              menuRef={menuRef}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onMenuToggle={handleMenuToggle}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              displayDate={formatApplicationEditedAt(
                isCreated ? form.createdAt : form.editedAt,
              )}
            />
          ))}
        </Styled.CardList>
      </Styled.Content>
    </Styled.Container>

    <MobileFloatingButton
      onClick={onCreateNew}
      icon={addLargeIcon}
      ariaLabel='새 지원서 만들기'
      bottom='calc(101px + env(safe-area-inset-bottom))'
    />
    </>
  );
};

export default ApplicationYearDetailPage;
