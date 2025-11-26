import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useGetApplicationlist } from '@/hooks/queries/application/useGetApplicationlist';
import Spinner from '@/components/common/Spinner/Spinner';
import { useAdminClubContext } from '@/context/AdminClubContext';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopApplicantsListTab from './DesktopApplicantsListTab';
import MobileApplicantsListTab from './MobileApplicantsListTab';

const ApplicationListTab = () => {
  const { data: allforms, isLoading, isError, error } = useGetApplicationlist();
  const navigate = useNavigate();
  const { setApplicationFormId } = useAdminClubContext();
  const isMobile = useIsMobileView();
  // const { mutate: deleteApplication } = useDeleteApplication();

  const handleGoToNewForm = () => {
    setApplicationFormId(null);
    navigate('/admin/application-list/edit');
  };
  const handleGoToDetailForm = (applicationFormId: string) => {
    setApplicationFormId(applicationFormId);
    navigate(`/admin/applicants-list/${applicationFormId}`);
  };

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

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const handleMoreButtonClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (row 전체가 클릭되지 않도록)
    setOpenMenuId(openMenuId === id ? null : id); // 같은 버튼 누르면 닫기, 다른 버튼 누르면 열기
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

  const semesterGroups = allforms?.forms || [];

  const formatDateTime = (dateTimeString: string) => {
    const now = new Date();
    const date = new Date(dateTimeString);
    const isToday =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();
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

  const props = {
    semesterGroups,
    handleGoToNewForm,
    handleGoToDetailForm,
    openMenuId,
    handleMoreButtonClick,
    menuRef,
    formatDateTime,
  };

  return isMobile ? (
    <MobileApplicantsListTab {...props} />
  ) : (
    <DesktopApplicantsListTab {...props} />
  );
};

export default ApplicationListTab;
