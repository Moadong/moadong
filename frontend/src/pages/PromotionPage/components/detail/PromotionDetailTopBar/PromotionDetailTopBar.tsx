import { useNavigate } from 'react-router-dom';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import { requestNavigateBack } from '@/utils/webviewBridge';
import * as Styled from './PromotionDetailTopBar.styles';

const PromotionDetailTopBar = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    const handled = requestNavigateBack();
    if (!handled) {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <Styled.Container>
      <Styled.BackButton onClick={handleBackClick} aria-label='뒤로가기'>
        <PrevButtonIcon width={36} height={36} />
      </Styled.BackButton>

      <Styled.Title>이벤트 정보</Styled.Title>
    </Styled.Container>
  );
};

export default PromotionDetailTopBar;
