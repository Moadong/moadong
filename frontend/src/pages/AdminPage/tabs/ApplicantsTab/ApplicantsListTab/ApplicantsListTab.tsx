import * as Styled from './ApplicantsListTab.styles';
import Plus from '@/assets/images/icons/Plus.svg';
import Morebutton from '@/assets/images/icons/Morebutton.svg';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import ApplicationMenu from '../../ApplicationListTab/ApplicationMenu';
import { useGetApplicationlist } from '@/hooks/queries/application/useGetApplicationlist';
import Spinner from '@/components/common/Spinner/Spinner';
import { useAdminClubContext } from '@/context/AdminClubContext';
// import { useDeleteApplication } from '@/hooks/queries/application/useDeleteApplication';
import { ApplicationFormItem, SemesterGroup } from '@/types/application';
import { updateApplicationStatus } from '@/apis/application/updateApplication';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

const ApplicationListTab = () => {
  const {data: allforms, isLoading, isError, error} = useGetApplicationlist();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setApplicationFormId } = useAdminClubContext();
  // const { mutate: deleteApplication } = useDeleteApplication();
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_INITIAL_ITEMS = 3;

  const handleGoToNewForm = () => {
    setApplicationFormId(null);
    navigate('/admin/application-list/edit');
  };
  const handleGoToDetailForm = (applicationFormId: string) => {
    setApplicationFormId(applicationFormId);
    navigate(`/admin/applicants-list/${applicationFormId}`);
  }

  // const handleDeleteApplication = (applicationFormId: string) => {
  //   // 사용자에게 재확인
  //   if (window.confirm('지원서 양식을 정말 삭제하시겠습니까?\n삭제된 양식은 복구할 수 없습니다.')) {
  //     deleteApplication(applicationFormId, {
  //       onSuccess: () => {
  //         setOpenMenuId(null);
  //         // 성공 알림
  //         alert('삭제되었습니다.');
  //       },
  //     });
  //   }
  // };

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

  const formatDateTime = (dateTimeString: string) => {
    const now = new Date();
    const date = new Date(dateTimeString);
    const isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
    if (isToday) {
      // [오늘 날짜인 경우] 시간만 표시
      return date.toLocaleString('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      // [오늘 날짜가 아닌 경우] 날짜만 표시
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  };

  const activeForms = semesterGroups.flatMap(group => group.forms).filter(form => form.status === 'ACTIVE');

  const formsToDisplay = isExpanded ? activeForms : activeForms.slice(0, MAX_INITIAL_ITEMS);
  const showExpandButton = activeForms.length >= MAX_INITIAL_ITEMS;

  const ActiveListBody = styled(Styled.ApplicationList)`
    border-top-left-radius: 0;
  `;
  const ActiveApplicationRow = styled(Styled.ApplicationRow)`
    &:hover {
      background-color: #f8f9fa;
      &:first-child {
        border-top-right-radius: 20px;
      }
    }
  `;

  return (
    <Styled.Container>
      <Styled.Title>지원서 목록</Styled.Title>
      {activeForms.length > 0 && (
        <Styled.ActiveLIstContainer>
          <Styled.ActiveListTitleBox>
            <Styled.ActiveListTitle>대표지원서 모아보기</Styled.ActiveListTitle>
          </Styled.ActiveListTitleBox>
          
          <ActiveListBody>
            {formsToDisplay.map((application: ApplicationFormItem) => {
              const isActive = true;
              const uniqueKeyPrefix = 'activelist';
              const currentMenuKey = `${uniqueKeyPrefix}-${application.id}`;
              return (
                <ActiveApplicationRow key={application.id}>
                  <Styled.ApplicationTitle $active={isActive} onClick={() => handleGoToDetailForm(application.id)}>
                    {application.title}
                  </Styled.ApplicationTitle>
                  <Styled.ApplicationDatetable>
                    <Styled.ApplicationDate>
                      {formatDateTime(application.editedAt)}
                    </Styled.ApplicationDate>
                    <Styled.MoreButtonContainer
                      ref={openMenuId === currentMenuKey ? menuRef : null}
                    >
                      <Styled.MoreButton
                        onClick={(e) => handleMenuToggle(e, application.id, uniqueKeyPrefix)}
                      >
                        <Styled.MoreButtonIcon src={Morebutton} />
                      </Styled.MoreButton>
                      {openMenuId === currentMenuKey && (
                        <ApplicationMenu
                          isActive={isActive}
                          onToggleStatus={() => handleToggleClick(application.id, application.status)}
                        />
                      )}
                    </Styled.MoreButtonContainer>
                  </Styled.ApplicationDatetable>
                </ActiveApplicationRow>
              );
            })}
            {showExpandButton && (
                <Styled.ExpandButton onClick={handleToggleExpand}>
                  {isExpanded ? '접기' : '펼쳐보기'}
                  {/* CSS에서 꺾쇠 아이콘(⌄)을 추가했습니다. */}
                </Styled.ExpandButton>
            )}
          </ActiveListBody>
        </Styled.ActiveLIstContainer>
      )}
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
          {(group.forms.map((application: ApplicationFormItem) => {
            const isActive = application.status === 'ACTIVE';
            const currentMenuKey = `${groupUniqueKeyPrefix}-${application.id}`;
            return (
            <Styled.ApplicationRow key={application.id}>
              <Styled.ApplicationTitle $active={isActive} onClick={() => handleGoToDetailForm(application.id)}>
                {application.title}
              </Styled.ApplicationTitle>
              <Styled.ApplicationDatetable>
                <Styled.ApplicationDate>
                  {formatDateTime(application.editedAt)}
                </Styled.ApplicationDate>
                <Styled.MoreButtonContainer
                  ref={openMenuId === currentMenuKey ? menuRef : null}
                >
                  <Styled.MoreButton
                    onClick={(e) => handleMenuToggle(e, application.id, groupUniqueKeyPrefix)}
                  >
                    <Styled.MoreButtonIcon src={Morebutton} />
                  </Styled.MoreButton>
                  {openMenuId === currentMenuKey && (
                    <ApplicationMenu
                      isActive={isActive}
                      // onDelete={() => handleDeleteApplication(application.id)}
                    />
                  )}
                </Styled.MoreButtonContainer>
              </Styled.ApplicationDatetable>
            </Styled.ApplicationRow>
            );
          }))}
        </Styled.ApplicationList>
      )})}
    </Styled.Container>
  );
};

export default ApplicationListTab;
