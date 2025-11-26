import React from 'react';
import * as Styled from './ApplicationListTab.styles';
import checkBox from '@/assets/images/icons/checkBox.svg';
import Delete_applicant from '@/assets/images/icons/Delete_applicant.svg';
import Pencil from '@/assets/images/icons/pencil_icon_3.svg';
import check_inactive from '@/assets/images/icons/check_inactive.svg';

interface ApplicationMenuProps {
  isActive: boolean;
  // onDelete: () => void;
  onToggleStatus?: () => void;
}

const ApplicationMenu = ({ isActive, onToggleStatus, 
  // onDelete
 }: ApplicationMenuProps) => {
  const onEditTitle = () => console.log('제목 수정하기');
  const toggleButtonText = isActive ? '기본지원서 해제' : '기본지원서로 설정';

  return (
    <Styled.MenuContainer>
      <Styled.MenuItem onClick={onToggleStatus} className='default'>
        {isActive ? (
          <Styled.MenuIcon src={checkBox} />
        ) : (
          <Styled.MenuIcon src={check_inactive} />
        )}
        {toggleButtonText}
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
