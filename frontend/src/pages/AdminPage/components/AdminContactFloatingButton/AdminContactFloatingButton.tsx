import KakaoIcon from '@/assets/images/icons/kakao.svg?react';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import * as Styled from './AdminContactFloatingButton.styles';

const ADMIN_CONTACT_OPEN_CHAT_URL = 'https://open.kakao.com/o/s21dRWjh';

const AdminContactFloatingButton = () => {
  const { isDisabled } = useScrollTrigger();

  if (isDisabled) return null;

  return (
    <Styled.ContactButton
      href={ADMIN_CONTACT_OPEN_CHAT_URL}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='모아동 운영진 카카오 오픈채팅 열기'
    >
      <KakaoIcon aria-hidden />
      <Styled.Label>운영진 문의</Styled.Label>
    </Styled.ContactButton>
  );
};

export default AdminContactFloatingButton;
