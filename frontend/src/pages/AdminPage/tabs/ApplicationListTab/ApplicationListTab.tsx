import * as Styled from './ApplicationListTab.styles';
import Plus from '@/assets/images/icons/Plus.svg';
import expandArrow from '@/assets/images/icons/ExpandArrow.svg';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useGetApplicationlist } from '@/hooks/queries/application/useGetApplicationlist';
import Spinner from '@/components/common/Spinner/Spinner';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useDeleteApplication } from '@/hooks/queries/application/useDeleteApplication';
import { ApplicationFormItem, SemesterGroup } from '@/types/application';
import { updateApplicationStatus } from '@/apis/application/updateApplication';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import ApplicationRowItem from '@/pages/AdminPage/components/ApplicationRow/ApplicationRowItem';

const ApplicationListTab = () => {
  const {data: allforms, isLoading, isError, error} = useGetApplicationlist();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setApplicationFormId } = useAdminClubContext();
  const { mutate: deleteApplication } = useDeleteApplication();
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_INITIAL_ITEMS = 3;

  const handleGoToNewForm = () => {
    setApplicationFormId(null);
    navigate('/admin/application-list/edit');
  };
  const handleGoToEditForm = (applicationFormId: string) => {
    setApplicationFormId(applicationFormId);
    navigate(`/admin/application-list/edit`);
  }

  const handleDeleteApplication = (applicationFormId: string) => {
    // 사용자에게 재확인
    if (window.confirm('지원서 양식을 정말 삭제하시겠습니까?\n삭제된 양식은 복구할 수 없습니다.')) {
      deleteApplication(applicationFormId, {
        onSuccess: () => {
          setOpenMenuId(null);
          // 성공 알림
          alert('삭제되었습니다.');
        },
      });
    }
  };

  const handleToggleClick = async (applicationFormId: string, currentStatus: string) => {
    try {
      await updateApplicationStatus(
        applicationFormId,
        currentStatus
      );
      queryClient.invalidateQueries({ queryKey: ['applicationForm'] });
      setOpenMenuId(null);
    } catch (error) {
      console.error('지원서 상태 변경 실패:', error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const handleMenuToggle = (e: React.MouseEvent, id: string, contextPrefix: string) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (row 전체가 클릭되지 않도록)
    const uniqueKey = `${contextPrefix}-${id}`;
    setOpenMenuId(openMenuId === uniqueKey ? null : uniqueKey); // 같은 버튼 누르면 닫기, 다른 버튼 누르면 열기
  };

  useEffect(() => {
    //더보기 메뉴 외부 클릭 시 메뉴 닫기
    const handleOutsideClick = (e: MouseEvent) => {
      // menuRef.current가 있고, 클릭된 영역이 메뉴 영역(menuRef.current)에 포함되지 않을 때
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null); // 메뉴를 닫습니다.
      }
    };

    // 메뉴가 열려 있을 때만 이벤트 리스너를 추가합니다.
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    // 클린업 함수: 컴포넌트가 사라지거나, openMenuId가 바뀌기 전에 리스너를 제거합니다.
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [openMenuId]); // openMenuId가 변경될 때마다 이 훅을 다시 실행합니다.

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  const semesterGroups: SemesterGroup[] = allforms?.forms || [];

  const activeForms = semesterGroups.flatMap(group => group.forms).filter(form => form.status === 'ACTIVE');

  const formsToDisplay = isExpanded ? activeForms : activeForms.slice(0, MAX_INITIAL_ITEMS);
  const showExpandButton = activeForms.length > MAX_INITIAL_ITEMS;
  const overCount = activeForms.length - MAX_INITIAL_ITEMS;

  const ActiveListBody = styled(Styled.ApplicationList)`
    border-top-left-radius: 0;
  `;
  const ActiveApplicationRow = styled(ApplicationRowItem)`
    &:hover {
      background-color: #F2F2F2;
      &:first-child {
        border-top-right-radius: 20px;
      }
    }
  `;

  return (
    <Styled.Container>
      <Styled.Title>지원서 목록</Styled.Title>
        <Styled.ActiveListContainer>
          <Styled.ActiveListTitleBox>
            <Styled.ActiveListTitle>게시된 지원서</Styled.ActiveListTitle>
          </Styled.ActiveListTitleBox>
          {activeForms.length >0 ? (
          <ActiveListBody>
            {formsToDisplay.map((application: ApplicationFormItem) => (
              <ActiveApplicationRow
                  key={application.id}
                  isActive={true}
                  application={application}
                  uniqueKeyPrefix="activelist"
                  openMenuId={openMenuId}
                  menuRef={menuRef}
                  onToggleStatus={handleToggleClick}
                  onEdit={handleGoToEditForm}
                  onMenuToggle={handleMenuToggle}
                  onDelete={handleDeleteApplication}
                />
            ))}
            {showExpandButton && (
                <Styled.ExpandButton onClick={handleToggleExpand}>
                  {isExpanded ? '접어두기' : `펼쳐보기 (외 ${overCount}개)`}
                  <Styled.ExpandArrow src={expandArrow} $isExpanded={isExpanded} />
                </Styled.ExpandButton>
            )}
          </ActiveListBody>
          ) : (
            <ActiveListBody>
              <Styled.MessageContainer>
                <Styled.NoActiveFormsMessage>활성화된 지원서 없음</Styled.NoActiveFormsMessage>
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
        const semesterTermLabel = group.semesterTerm === 'FIRST' ? '1학기' : '2학기';
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
          {(group.forms.map((application: ApplicationFormItem) => (
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
               />
      )))}
        </Styled.ApplicationList>
      )})}
    </Styled.Container>
  );
};

export default ApplicationListTab;
