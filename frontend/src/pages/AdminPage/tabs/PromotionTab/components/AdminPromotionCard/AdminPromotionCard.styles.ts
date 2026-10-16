import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Wrapper = styled.div`
  position: relative;
`;

/* 카드 본문 전체가 수정 화면으로 가는 버튼이다 */
/*
 * 카드를 button 안에 넣으면 button이 자식을 자기 박스로 잘라내
 * 카드 그림자(밝은 배경에서 모서리를 보이게 하는 유일한 요소)가 사라진다.
 * 그래서 카드 위에 투명 버튼을 덮는다. border-radius는 포커스 링을 카드 모양에 맞추려고 준다.
 */
export const CardOverlayButton = styled.button`
  position: absolute;
  inset: 0;
  padding: 0;
  border: none;
  border-radius: 14px;
  background: none;
  cursor: pointer;
`;

/* 카드의 overflow: hidden 밖에 있어야 메뉴가 잘리지 않는다 */
export const MenuContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;

  &:hover {
    background-color: ${colors.base.white};
  }
`;
