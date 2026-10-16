import LoadingDots from '../LoadingDots/LoadingDots';
import * as Styled from './CalendarLinkButton.styles';

export type CalendarLinkStatus = 'idle' | 'loading' | 'connected';

interface CalendarLinkButtonProps {
  status: CalendarLinkStatus;
  onClick: () => void;
}

const CalendarLinkButton = ({ status, onClick }: CalendarLinkButtonProps) => (
  <Styled.LinkButton $status={status} onClick={onClick}>
    {status === 'idle' && '일정 가져오기'}
    {status === 'connected' && '일정 연동 해제'}
    {status === 'loading' && (
      <>
        <Styled.LoadingLabel>불러오는 중</Styled.LoadingLabel>
        <Styled.CancelLabel>취소</Styled.CancelLabel>
        <LoadingDots />
      </>
    )}
  </Styled.LinkButton>
);

export default CalendarLinkButton;
