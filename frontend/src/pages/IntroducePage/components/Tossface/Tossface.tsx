// 토스페이스 이모지 글꼴을 불러오고, 이모지 한 글자를 그 글꼴로 그리는 컴포넌트
import styled from 'styled-components';

/** 토스페이스 공식 배포본(jsDelivr). 버전을 고정해 갑자기 바뀌지 않게 한다 */
const TOSSFACE_CSS =
  'https://cdn.jsdelivr.net/gh/toss/tossface@v1.6.1/dist/tossface.css';

/** React 19가 <head>로 올려 한 번만 넣는다 */
export const TossfaceStylesheet = () => (
  <link rel='stylesheet' href={TOSSFACE_CSS} precedence='default' />
);

/* 버튼처럼 글꼴이 따로 지정된 곳에서도 이모지만 토스페이스로 보이게 한다 */
export const Emoji = styled.span`
  display: inline-block;
  font-family: 'Tossface', sans-serif;
  font-style: normal;
  line-height: 1;
`;
