import styled from 'styled-components';

export const PlayArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 게이지를 버튼 위에 배치. ClickButton의 음수 마진(-100px)을 일부 상쇄해
     게이지가 버튼 상단 빈 영역 위에 자연스럽게 놓이도록 한다. */
  & > *:first-child {
    position: relative;
    z-index: 3;
    margin-bottom: 40px;
  }
`;
