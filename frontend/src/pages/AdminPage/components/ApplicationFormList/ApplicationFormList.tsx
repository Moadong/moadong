import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import expandArrow from '@/assets/images/icons/ExpandArrow.svg';
import Plus from '@/assets/images/icons/Plus.svg';
import Spinner from '@/components/common/Spinner/Spinner';
import {
  useDeleteApplication,
  useDuplicateApplication,
  useGetApplicationList,
  useUpdateApplicationStatus,
} from '@/hooks/Queries/useApplication';
import ApplicationRowItem from '@/pages/AdminPage/components/ApplicationRow/ApplicationRowItem';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import * as Styled from '@/pages/AdminPage/tabs/ApplicationListTab/ApplicationListTab.styles';
import {
  ApplicationFormGroup,
  ApplicationFormItem,
  ApplicationFormStatus,
} from '@/types/application';

const MAX_INITIAL_ITEMS = 3;

const ActiveListBody = styled(Styled.ApplicationList)`
  border-top-left-radius: 0;
`;
const ActiveApplicationRow = styled(ApplicationRowItem)<{
  $hoverColor: string;
}>`
  &:hover {
    background-color: ${({ $hoverColor }) => $hoverColor};
    &:first-child {
      border-top-right-radius: 20px;
    }
  }
`;

interface ApplicationFormListProps {
  /** 지원서 행 클릭/편집 시 이동 (탭마다 대상 라우트가 다름) */
  onEdit: (applicationFormId: string) => void;
  rowHoverColor: string;
  deleteErrorMessage: string;
  /** 지정 시 복제 전에 확인창을 띄운다 */
  duplicateConfirmMessage?: string;
  /** 지정 시 복제 성공 후 알림을 띄운다 */
  duplicateSuccessMessage?: string;
}

/**
 * 지원서 목록 화면(게시된 지원서 핀 섹션 + 년도별 전체 그룹 섹션).
 * ApplicationListTab·ApplicantsListTab이 동일한 로직/렌더를 쓰므로 공유한다.
 * 탭별 차이(이동 대상·메시지·복제 동작·hover색)만 props로 받는다.
 */
const ApplicationFormList = ({
  onEdit,
  rowHoverColor,
  deleteErrorMessage,
  duplicateConfirmMessage,
  duplicateSuccessMessage,
}: ApplicationFormListProps) => {
  const navigate = useNavigate();
  const { data: allforms, isLoading, isError, error } = useGetApplicationList();
  const { mutate: deleteApplication } = useDeleteApplication();
  const { mutate: duplicateApplication } = useDuplicateApplication();
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleGoToNewForm = () => {
    navigate('/admin/application-list/edit');
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
          alert(deleteErrorMessage);
        },
      });
    }
  };

  const handleDuplicateApplication = (applicationFormId: string) => {
    if (duplicateConfirmMessage && !window.confirm(duplicateConfirmMessage)) {
      return;
    }
    duplicateApplication(applicationFormId, {
      onSuccess: () => {
        setOpenMenuId(null);
        if (duplicateSuccessMessage) alert(duplicateSuccessMessage);
      },
      onError: () => {
        alert('지원서 복제에 실패했습니다.');
      },
    });
  };

  const handleToggleClick = (
    applicationFormId: string,
    currentStatus: ApplicationFormStatus,
  ) => {
    updateStatus(
      { applicationFormId, currentStatus },
      {
        onSuccess: () => {
          setOpenMenuId(null);
        },
        onError: () => {
          alert('상태 변경에 실패했습니다.');
        },
      },
    );
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

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

  const formGroups: ApplicationFormGroup[] = allforms?.forms || [];

  const activeForms = formGroups
    .flatMap((group) => group.forms)
    .filter((form) => form.status === 'ACTIVE');

  const yearMap = new Map<number, ApplicationFormItem[]>();
  formGroups.forEach((group) => {
    const year = Number(group.semesterYear);
    const existing = yearMap.get(year) ?? [];
    yearMap.set(year, [...existing, ...group.forms]);
  });
  const groupedByYear = Array.from(yearMap.entries()).map(
    ([semesterYear, forms]) => ({ semesterYear, forms }),
  );

  const formsToDisplay = isExpanded
    ? activeForms
    : activeForms.slice(0, MAX_INITIAL_ITEMS);
  const showExpandButton = activeForms.length > MAX_INITIAL_ITEMS;
  const overCount = activeForms.length - MAX_INITIAL_ITEMS;

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
                $hoverColor={rowHoverColor}
                isActive={true}
                application={application}
                uniqueKeyPrefix='activelist'
                openMenuId={openMenuId}
                menuRef={menuRef}
                onToggleStatus={handleToggleClick}
                onEdit={onEdit}
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
                게시된 지원서 없음
              </Styled.NoActiveFormsMessage>
              <Styled.SuggestionText>
                지원서 카드 우측 메뉴에서 지원서 게시를 선택해 보세요.
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
      {groupedByYear.map((group) => (
        <Styled.ApplicationList key={group.semesterYear}>
          <Styled.ListHeader>
            <Styled.SemesterTitle>
              {group.semesterYear}년도
            </Styled.SemesterTitle>
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
              uniqueKeyPrefix={`yeargroup-${group.semesterYear}`}
              openMenuId={openMenuId}
              menuRef={menuRef}
              onEdit={onEdit}
              onMenuToggle={handleMenuToggle}
              onToggleStatus={handleToggleClick}
              onDelete={handleDeleteApplication}
              onDuplicate={handleDuplicateApplication}
            />
          ))}
        </Styled.ApplicationList>
      ))}
    </Styled.Container>
  );
};

export default ApplicationFormList;
