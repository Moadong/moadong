// 단톡방 장면의 레이아웃·말풍선·기본 프로필 스타일 (익숙한 메신저 화면에 맞춘 장면 색 포함)
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

/*
 * 아래 색은 디자인 토큰이 아니라 "누구나 아는 단톡방" 장면을 재현하기 위한 색이다.
 * 대화방 배경, 시간·이름 글자색을 실제 메신저 화면에 맞췄다.
 */
const SCENE = {
  background: 'rgb(186, 206, 224)',
  name: 'rgba(0, 0, 0, 0.68)',
  time: 'rgba(0, 0, 0, 0.45)',
  icon: 'rgba(0, 0, 0, 0.72)',
  // 날짜 띠 위 흰 글씨가 읽히게 조금 진하게
  divider: 'rgba(0, 0, 0, 0.26)',
};

const PROFILE_SIZE = 40;
const TAIL_SIZE = 8;

export const Window = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  border-radius: 28px;
  overflow: hidden;
  background: ${SCENE.background};
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 24px 60px rgba(17, 17, 17, 0.14);
  font-family: inherit;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 16px 10px 10px;
  color: ${SCENE.icon};
`;

export const HeaderIcon = styled.span`
  display: inline-flex;
`;

export const RoomName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.base.black};
`;

export const MemberCount = styled.span`
  font-size: 15px;
  color: ${SCENE.time};
`;

export const HeaderActions = styled.span`
  display: inline-flex;
  gap: 14px;
  margin-left: auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2px 12px 16px;
`;

export const DateDivider = styled.span`
  align-self: center;
  margin: 2px 0 10px;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${SCENE.divider};
  font-size: 12px;
  color: ${colors.base.white};
`;

export const Row = styled(motion.div)<{
  $mine: boolean;
  $isFirstOfGroup: boolean;
}>`
  display: flex;
  gap: 8px;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
  margin-top: ${({ $isFirstOfGroup }) => ($isFirstOfGroup ? 10 : 4)}px;
  transform-origin: ${({ $mine }) => ($mine ? 'right' : 'left')} bottom;
`;

/* 프로필: 둥근 사각형 배경 위 동물 이모지 */
export const Profile = styled.span<{ $tone: string }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${PROFILE_SIZE}px;
  height: ${PROFILE_SIZE}px;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ $tone }) => $tone};
  font-size: 24px;
`;

export const ProfileSpace = styled.span`
  flex-shrink: 0;
  width: ${PROFILE_SIZE}px;
`;

export const Content = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
  gap: 5px;
  min-width: 0;
`;

export const SenderName = styled.span`
  font-size: 12px;
  color: ${SCENE.name};
`;

export const BubbleLine = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 5px;
`;

/* 묶음의 첫 말풍선만 위쪽 모서리에 꼬리를 단다(남은 왼쪽, 나는 오른쪽) */
export const Bubble = styled.p<{ $mine: boolean; $hasTail: boolean }>`
  position: relative;
  max-width: 240px;
  padding: 7px 10px;
  border-radius: 12px;
  background: ${({ $mine }) =>
    $mine ? colors.social.kakao : colors.base.white};
  font-size: 14px;
  line-height: 1.42;
  color: ${colors.gray[950]};
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;

  ${({ $hasTail, $mine }) =>
    $hasTail &&
    css`
      ${$mine ? 'border-top-right-radius' : 'border-top-left-radius'}: 3px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        ${$mine ? 'right' : 'left'}: -${TAIL_SIZE - 2}px;
        width: ${TAIL_SIZE}px;
        height: ${TAIL_SIZE + 2}px;
        background: inherit;
        clip-path: ${$mine
          ? 'polygon(0 0, 100% 0, 0 100%)'
          : 'polygon(0 0, 100% 0, 100% 100%)'};
      }
    `}

  ${media.mobile} {
    max-width: 210px;
  }
`;

export const Meta = styled.span<{ $mine: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
  gap: 1px;
`;

export const Unread = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.secondary[2].main};
`;

export const Time = styled.span`
  font-size: 12px;
  color: ${SCENE.time};
`;

export const InputBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${colors.base.white};
  color: ${colors.gray[600]};
`;

export const InputIcon = styled.span`
  display: inline-flex;
`;

export const InputField = styled.span`
  flex: 1;
  height: 34px;
  border-radius: 17px;
  background: ${colors.gray[100]};
`;
