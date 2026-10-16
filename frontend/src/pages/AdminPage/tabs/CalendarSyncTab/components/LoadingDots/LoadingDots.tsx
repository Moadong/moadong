import * as Styled from './LoadingDots.styles';

/** 버튼 안에서 진행 중임을 알리는 점 3개 애니메이션 */
const LoadingDots = () => (
  <Styled.Dots aria-hidden>
    <Styled.Dot $order={0} />
    <Styled.Dot $order={1} />
    <Styled.Dot $order={2} />
  </Styled.Dots>
);

export default LoadingDots;
