import * as Styled from './ApplicationListTab.styles';
import Plus from '@/assets/images/icons/Plus.svg';
import Morebutton from '@/assets/images/icons/Morebutton.svg';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import ApplicationMenu from './ApplicationMenu';

const initialdata = {
  '2025 2학기': [
    {
      id: 1,
      title: '○○동아리 8기 신입 지원서',
      date: '오후 12:46',
      active: true,
    },
    {
      id: 2,
      title: '○○동아리 8기 신입 지원서',
      date: '오후 4:46',
      active: false,
    },
    {
      id: 3,
      title: '○○동아리 8기 신입 지원서',
      date: '오후 4:46',
      active: false,
    },
  ],
  '2025 1학기': [
    {
      id: 4,
      title: '○○동아리 7기 신입 지원서',
      date: '2025. 4. 26',
      active: true,
    },
    {
      id: 5,
      title: '○○동아리 7기 신입 지원서',
      date: '2025. 4. 26',
      active: false,
    },
    {
      id: 6,
      title: '○○동아리 7기 신입 지원서',
      date: '2025. 4. 26',
      active: false,
    },
  ],
};

const ApplicationListTab = () => {
  const [data, setData] = useState(initialdata);
  const navigate = useNavigate();
  const handleGoToNewForm = () => {
    // 새 지원서 생성 경로로 이동합니다.
    navigate('/admin/application-list/edit');
  };
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const handleMoreButtonClick = (e: React.MouseEvent, id: number) => {
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

  return (
    <Styled.Container>
      <Styled.Title>지원서 목록</Styled.Title>
      <Styled.Header>
        <Styled.AddButton onClick={handleGoToNewForm}>
          새 양식 만들기 <Styled.PlusIcon src={Plus} />{' '}
        </Styled.AddButton>
      </Styled.Header>
      {Object.entries(data).map(([semester, applications]) => (
        <Styled.ApplicationList key={semester}>
          <Styled.ListHeader>
            <Styled.SemesterTitle>{semester}</Styled.SemesterTitle>
            <Styled.DateHeader>
              <Styled.Separation_Bar />
              최종 수정 날짜
            </Styled.DateHeader>
          </Styled.ListHeader>
          {applications.map((application) => (
            <Styled.ApplicationRow key={application.id}>
              <Styled.ApplicationTitle $active={application.active}>
                {application.title}
              </Styled.ApplicationTitle>
              <Styled.ApplicationDatetable>
                <Styled.ApplicationDate>
                  {application.date}
                </Styled.ApplicationDate>
                <Styled.MoreButtonContainer
                  ref={openMenuId === application.id ? menuRef : null}
                >
                  <Styled.MoreButton
                    onClick={(e) => handleMoreButtonClick(e, application.id)}
                  >
                    <Styled.MoreButtonIcon src={Morebutton} />
                  </Styled.MoreButton>
                  {openMenuId === application.id && (
                    <ApplicationMenu isActive={application.active} />
                  )}
                </Styled.MoreButtonContainer>
              </Styled.ApplicationDatetable>
            </Styled.ApplicationRow>
          ))}
        </Styled.ApplicationList>
      ))}
    </Styled.Container>
  );
};

export default ApplicationListTab;
