import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import plusIcon from '@/assets/images/icons/Plus.svg';
import SortAscIcon from '@/assets/images/icons/sort_asc_icon.svg?react';
import SortDescIcon from '@/assets/images/icons/sort_desc_icon.svg?react';
import Spinner from '@/components/common/Spinner/Spinner';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  useDeleteApplication,
  useDuplicateApplication,
  useGetApplicationList,
  useUpdateApplicationStatus,
} from '@/hooks/Queries/useApplication';
import MobileFloatingButton from '@/pages/AdminPage/components/MobileFloatingButton/MobileFloatingButton';
import {
  ApplicationFormGroup,
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';
import ApplicationActiveSectionMobile from './components/mobile/ApplicationActiveSectionMobile/ApplicationActiveSectionMobile';
import ApplicationListCardMobile from './components/mobile/ApplicationListCardMobile/ApplicationListCardMobile';
import * as Styled from './ApplicationListTabMobile.styles';

type SortOrder = 'newest' | 'oldest';

const ApplicationListTabMobile = () => {
  const navigate = useNavigate();
  const { data: allforms, isLoading, isError, error } = useGetApplicationList();
  const { mutate: deleteApplication } = useDeleteApplication();
  const { mutate: duplicateApplication } = useDuplicateApplication();
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuToggle = (
    e: React.MouseEvent,
    id: string,
    prefix: string,
  ) => {
    e.stopPropagation();
    const key = `${prefix}-${id}`;
    setOpenMenuId((prev) => (prev === key ? null : key));
  };

  const handleToggleStatus = (id: string, status: ApplicationFormStatus) => {
    updateStatus(
      { applicationFormId: id, currentStatus: status },
      {
        onSuccess: () => setOpenMenuId(null),
        onError: () => alert('상태 변경에 실패했습니다.'),
      },
    );
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/application-list/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        '지원서 양식을 정말 삭제하시겠습니까?\n삭제된 양식은 복구할 수 없습니다.',
      )
    ) {
      deleteApplication(id, {
        onSuccess: () => setOpenMenuId(null),
        onError: () => alert('지원서 삭제에 실패했습니다.'),
      });
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateApplication(id, {
      onSuccess: () => {
        setOpenMenuId(null);
        alert('지원서가 성공적으로 복제되었습니다.');
      },
      onError: () => alert('지원서 복제에 실패했습니다.'),
    });
  };

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

  if (isLoading) return <Spinner />;
  if (isError) return <div>오류가 발생했습니다: {error.message}</div>;

  const formGroups: ApplicationFormGroup[] = allforms?.forms ?? [];

  const activeForms = formGroups
    .flatMap((group) => group.forms)
    .filter((form) => form.status === 'ACTIVE');

  const yearMap = new Map<number, ApplicationFormItem[]>();
  formGroups.forEach((group) => {
    const year = Number(group.semesterYear);
    yearMap.set(year, [...(yearMap.get(year) ?? []), ...group.forms]);
  });

  const groupedByYear = Array.from(yearMap.entries())
    .map(([semesterYear, forms]) => ({ semesterYear, forms }))
    .sort((a, b) =>
      sortOrder === 'newest'
        ? b.semesterYear - a.semesterYear
        : a.semesterYear - b.semesterYear,
    );

  const isNewest = sortOrder === 'newest';

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar title='지원서 관리' onBack={() => navigate('/admin')} />

        <Styled.Content>
          <Styled.SectionHeader>
            <Styled.SectionTitle>게시된 지원서</Styled.SectionTitle>
            <Styled.SectionSubtitle>
              게시된 지원서는 즉시 지원자에게 공개됩니다
            </Styled.SectionSubtitle>
          </Styled.SectionHeader>

          <Styled.MainContent>
            <ApplicationActiveSectionMobile
              activeForms={activeForms}
              openMenuId={openMenuId}
              menuRef={menuRef}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
              onMenuToggle={handleMenuToggle}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />

            <Styled.ListSection>
              <Styled.SortRow>
                <Styled.SortButton
                  type='button'
                  onClick={() => setSortOrder(isNewest ? 'oldest' : 'newest')}
                >
                  {isNewest ? <SortDescIcon /> : <SortAscIcon />}
                  <Styled.SortText>
                    {isNewest ? '최신 순' : '오래된 순'}
                  </Styled.SortText>
                </Styled.SortButton>
              </Styled.SortRow>

              <Styled.CardList>
                {groupedByYear.flatMap((group) =>
                  group.forms.map((form) => (
                    <ApplicationListCardMobile
                      key={form.id}
                      application={form}
                      isActive={form.status === 'ACTIVE'}
                      uniqueKeyPrefix={`yeargroup-${group.semesterYear}`}
                      openMenuId={openMenuId}
                      menuRef={menuRef}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleEdit}
                      onMenuToggle={handleMenuToggle}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onNavigate={() =>
                        navigate(`/admin/applicants-list/${form.id}`)
                      }
                    />
                  )),
                )}
              </Styled.CardList>
            </Styled.ListSection>
          </Styled.MainContent>
        </Styled.Content>
      </Styled.MobileContainer>

      <MobileFloatingButton
        onClick={() => navigate('/admin/application-list/edit')}
        icon={plusIcon}
        ariaLabel='새 지원서 만들기'
      />
    </>
  );
};

export default ApplicationListTabMobile;
