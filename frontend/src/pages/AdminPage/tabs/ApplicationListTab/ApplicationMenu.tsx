import React from 'react';
import * as Styled from './ApplicationListTab.styles';
import checkBox from '@/assets/images/icons/checkBox.svg';
import Delete_applicant from '@/assets/images/icons/Delete_applicant.svg';
import Pencil from '@/assets/images/icons/pencil_icon_3.svg';
import check_inactive from '@/assets/images/icons/check_inactive.svg';

interface ApplicationMenuProps {
  isActive: boolean;
  // onDelete: () => void;
}

const ApplicationMenu = ({ isActive, 
  // onDelete
 }: ApplicationMenuProps) => {
  // 각 메뉴 아이템 클릭 시 실행될 함수 (지금은 비워둠)
  const onSetDefault = () => console.log('기본지원서로 설정');
  const onEditTitle = () => console.log('제목 수정하기');

  return (
    <Styled.MenuContainer>
      <Styled.MenuItem onClick={onSetDefault} className='default'>
        {isActive ? (
          <Styled.MenuIcon src={checkBox} />
        ) : (
          <Styled.MenuIcon src={check_inactive} />
        )}
        기본지원서로 설정
      </Styled.MenuItem>
      <Styled.Separator />
      <Styled.MenuItem onClick={onEditTitle}>
        <Styled.MenuIcon src={Pencil} /> 제목 수정하기
      </Styled.MenuItem>
      <Styled.MenuItem /*onClick={onDelete}*/ className='delete'>
        <Styled.MenuIcon src={Delete_applicant} /> 삭제
      </Styled.MenuItem>
    </Styled.MenuContainer>
  );
};

export default ApplicationMenu;
