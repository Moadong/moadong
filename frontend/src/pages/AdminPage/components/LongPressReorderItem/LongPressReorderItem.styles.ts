import styled from 'styled-components';

// 입력칸 밖 카드 영역은 길게 누를 때 글자가 선택되거나 iOS 길게 누르기 메뉴가 뜨지 않게 막는다.
// 입력칸은 텍스트 선택·편집이 그대로 되도록 다시 연다.
export const Content = styled.div`
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  input,
  textarea,
  [contenteditable='true'] {
    user-select: text;
    -webkit-user-select: text;
  }
`;
