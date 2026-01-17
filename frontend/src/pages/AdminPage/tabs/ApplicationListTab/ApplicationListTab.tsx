import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { updateApplicationStatus } from '@/apis/application/updateApplication';
import expandArrow from '@/assets/images/icons/ExpandArrow.svg';
import Plus from '@/assets/images/icons/Plus.svg';
import Spinner from '@/components/common/Spinner/Spinner';
import { useDeleteApplication } from '@/hooks/Queries/application/useDeleteApplication';
import { useDuplicateApplication } from '@/hooks/Queries/application/useDuplicateApplication';
import { useGetApplicationlist } from '@/hooks/Queries/application/useGetApplicationlist';
import ApplicationRowItem from '@/pages/AdminPage/components/ApplicationRow/ApplicationRowItem';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { ApplicationFormItem, SemesterGroup } from '@/types/application';
import * as Styled from './ApplicationListTab.styles';

const MAX_INITIAL_ITEMS = 3;

const ApplicationListTab = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: allforms, isLoading, isError, error } = useGetApplicationlist();
  const { mutate: deleteApplication } = useDeleteApplication();
  const { mutate: duplicateApplication } = useDuplicateApplication();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleGoToNewForm = () => {
    navigate('/admin/application-list/edit');
  };

  const handleGoToEditForm = (applicationFormId: string) => {
    navigate(`/admin/application-list/${applicationFormId}/edit`);
  };

  const handleDeleteApplication = (applicationFormId: string) => {
    if (
      window.confirm(
        '지원서 양식을 정말 삭제하시겠습니까?\n삭제된 양식은 복구할 수 없습니다.',
      )
    ) {
      deleteApplication(applicationFormId, {
        onSuccess: () => {
          setOpenMenuId(null);
        },
        onError: () => {
          alert('지원서 삭제에 실패했습니다.');
        },
      });
    }
  };

  const handleDuplicateApplication = (applicationFormId: string) => {
    duplicateApplication(applicationFormId, {
      onSuccess: () => {
        setOpenMenuId(null);
        alert('지원서가 성공적으로 복제되었습니다.');
      },
      onError: () => {
        alert('지원서 복제에 실패했습니다.');
      },
    });
  };

  const handleToggleClick = async (
    applicationFormId: string,
    currentStatus: string,
  ) => {
    try {
      await updateApplicationStatus(applicationFormId, currentStatus);
      queryClient.invalidateQueries({ queryKey: ['applicationForm'] });
      setOpenMenuId(null);
    } catch (error) {
      console.error('지원서 상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const handleMenuToggle = (
    e: React.MouseEvent,
    id: string,
    contextPrefix: string,
  ) => {
    e.stopPropagation();
    const uniqueKey = `${contextPrefix}-${id}`;
    setOpenMenuId(openMenuId === uniqueKey ? null : uniqueKey);
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

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  const semesterGroups: SemesterGroup[] = allforms?.forms || [];

  const activeForms = semesterGroups
    .flatMap((group) => group.forms)
    .filter((form) => form.status === 'ACTIVE');

  const formsToDisplay = isExpanded
    ? activeForms
    : activeForms.slice(0, MAX_INITIAL_ITEMS);
  const showExpandButton = activeForms.length > MAX_INITIAL_ITEMS;
  const overCount = activeForms.length - MAX_INITIAL_ITEMS;

  const ActiveListBody = styled(Styled.ApplicationList)`
    border-top-left-radius: 0;
  `;
  const ActiveApplicationRow = styled(ApplicationRowItem)`
    &:hover {
      background-color: #f2f2f2;
      &:first-child {
        border-top-right-radius: 20px;
      }
    }
  `;

  return (
    <Styled.Container>
      <div style={{ marginBottom: '24px' }}>
        <ContentSection.Header title='지원서 목록' />
      </div>
      <Styled.ActiveListContainer>
        <Styled.ActiveListTitleBox>
          <Styled.ActiveListTitle>게시된 지원서</Styled.ActiveListTitle>
        </Styled.ActiveListTitleBox>
        {activeForms.length > 0 ? (
          <ActiveListBody>
            {formsToDisplay.map((application: ApplicationFormItem) => (
              <ActiveApplicationRow
                key={application.id}
                isActive={true}
                application={application}
                uniqueKeyPrefix='activelist'
                openMenuId={openMenuId}
                menuRef={menuRef}
                onToggleStatus={handleToggleClick}
                onEdit={handleGoToEditForm}
                onMenuToggle={handleMenuToggle}
                onDelete={handleDeleteApplication}
                onDuplicate={handleDuplicateApplication}
              />
            ))}
            {showExpandButton && (
              <Styled.ExpandButton onClick={handleToggleExpand}>
                {isExpanded ? '접어두기' : `펼쳐보기 (외 ${overCount}개)`}
                <Styled.ExpandArrow
                  src={expandArrow}
                  $isExpanded={isExpanded}
                />
              </Styled.ExpandButton>
            )}
          </ActiveListBody>
        ) : (
          <ActiveListBody>
            <Styled.MessageContainer>
              <Styled.NoActiveFormsMessage>
                활성화된 지원서 없음
              </Styled.NoActiveFormsMessage>
              <Styled.SuggestionText>
                지원서 카드 우측 메뉴에서 지원서 활성화를 선택해 보세요.
              </Styled.SuggestionText>
            </Styled.MessageContainer>
          </ActiveListBody>
        )}
      </Styled.ActiveListContainer>
      <Styled.Header>
        <Styled.AddButton onClick={handleGoToNewForm}>
          새 양식 만들기 <Styled.PlusIcon src={Plus} />{' '}
        </Styled.AddButton>
      </Styled.Header>
      {semesterGroups.map((group: SemesterGroup) => {
        const semesterTermLabel =
          group.semesterTerm === 'FIRST' ? '1학기' : '2학기';
        const semesterTitle = `${group.semesterYear}년 ${semesterTermLabel}`;
        const groupUniqueKeyPrefix = `group_${group.semesterYear}_${group.semesterTerm}`;
        return (
          <Styled.ApplicationList key={semesterTitle}>
            <Styled.ListHeader>
              <Styled.SemesterTitle>{semesterTitle}</Styled.SemesterTitle>
              <Styled.DateHeader>
                <Styled.Separation_Bar />
                최종 수정 날짜
              </Styled.DateHeader>
            </Styled.ListHeader>
            {group.forms.map((application: ApplicationFormItem) => (
              <ApplicationRowItem
                key={application.id}
                application={application}
                isActive={application.status === 'ACTIVE'}
                uniqueKeyPrefix={groupUniqueKeyPrefix}
                openMenuId={openMenuId}
                menuRef={menuRef}
                onEdit={handleGoToEditForm}
                onMenuToggle={handleMenuToggle}
                onToggleStatus={handleToggleClick}
                onDelete={handleDeleteApplication}
                onDuplicate={handleDuplicateApplication}
              />
            ))}
          </Styled.ApplicationList>
        );
      })}
    </Styled.Container>
  );
};

export default ApplicationListTab;
