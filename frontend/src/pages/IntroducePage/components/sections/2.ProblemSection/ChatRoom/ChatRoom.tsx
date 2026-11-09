// 익숙한 메신저 단톡방처럼 메시지가 하나씩 도착하는 대화 장면 (보기 전용)
import { RefObject } from 'react';
import { Emoji } from '@/pages/IntroducePage/components/Tossface/Tossface';
import type { ChatMessage } from '@/pages/IntroducePage/constants/audience';
import { colors } from '@/styles/theme/colors';
import * as Styled from './ChatRoom.styles';

/** 단톡방에서 흔한 동물 프로필처럼, 보낸 사람마다 다른 이모지와 배경색을 준다 */
const PROFILE_EMOJIS = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'];
const PROFILE_TONES = [
  colors.secondary[5].back,
  colors.secondary[4].back,
  colors.secondary[1].back,
  colors.secondary[3].back,
  colors.secondary[2].back,
  colors.secondary[6].back,
];

const SenderProfile = ({ index }: { index: number }) => (
  <Styled.Profile
    aria-hidden='true'
    $tone={PROFILE_TONES[index % PROFILE_TONES.length]}
  >
    <Emoji>{PROFILE_EMOJIS[index % PROFILE_EMOJIS.length]}</Emoji>
  </Styled.Profile>
);

const ChevronLeft = () => (
  <svg viewBox='0 0 24 24' width='22' height='22' fill='none'>
    <path
      d='M15 5l-7 7 7 7'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
    <circle cx='11' cy='11' r='6.5' stroke='currentColor' strokeWidth='1.8' />
    <path
      d='M16 16l4 4'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
    />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox='0 0 24 24' width='20' height='20' fill='none'>
    <path
      d='M4 7h16M4 12h16M4 17h16'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox='0 0 24 24' width='22' height='22' fill='none'>
    <path
      d='M12 5v14M5 12h14'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
    />
  </svg>
);

const SmileIcon = () => (
  <svg viewBox='0 0 24 24' width='22' height='22' fill='none'>
    <circle cx='12' cy='12' r='8.5' stroke='currentColor' strokeWidth='1.6' />
    <circle cx='9' cy='10' r='1.1' fill='currentColor' />
    <circle cx='15' cy='10' r='1.1' fill='currentColor' />
    <path
      d='M8.5 14c.9 1.4 2.1 2 3.5 2s2.6-.6 3.5-2'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
    />
  </svg>
);

const HashIcon = () => (
  <svg viewBox='0 0 24 24' width='22' height='22' fill='none'>
    <path
      d='M9.5 4L8 20M16 4l-1.5 16M4.5 9h15M4 15h15'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
    />
  </svg>
);

interface ChatRoomProps {
  roomRef: RefObject<HTMLDivElement | null>;
  roomName: string;
  messages: ChatMessage[];
  /** 지금까지 도착한 메시지 수 */
  arrived: number;
}

const ChatRoom = ({ roomRef, roomName, messages, arrived }: ChatRoomProps) => {
  const senders = [
    ...new Set(messages.filter((m) => !m.mine).map((m) => m.sender)),
  ];
  const memberCount = senders.length + 1;

  return (
    <Styled.Window ref={roomRef} aria-label={`${roomName} 대화 예시`}>
      <Styled.Header aria-hidden='true'>
        <Styled.HeaderIcon>
          <ChevronLeft />
        </Styled.HeaderIcon>
        <Styled.RoomName>{roomName}</Styled.RoomName>
        <Styled.MemberCount>{memberCount}</Styled.MemberCount>
        <Styled.HeaderActions>
          <SearchIcon />
          <MenuIcon />
        </Styled.HeaderActions>
      </Styled.Header>

      <Styled.Body>
        <Styled.DateDivider>2026년 3월 2일 월요일</Styled.DateDivider>

        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const next = messages[index + 1];
          const mine = Boolean(message.mine);
          // 같은 사람이 이어서 보내면 프로필·이름·꼬리는 첫 메시지에만 붙인다
          const isFirstOfGroup = prev?.sender !== message.sender;
          // 시간은 같은 사람·같은 분의 묶음에서 마지막 메시지에만 붙인다
          const showTime =
            next?.sender !== message.sender || next?.time !== message.time;
          const hasArrived = index < arrived;

          const meta = (
            <Styled.Meta $mine={mine}>
              {mine && <Styled.Unread>1</Styled.Unread>}
              {showTime && <Styled.Time>{message.time}</Styled.Time>}
            </Styled.Meta>
          );

          return (
            // 아직 안 온 메시지도 자리를 잡아 둬서 도착할 때 대화방 높이가 변하지 않게 한다
            <Styled.Row
              key={`${message.sender}-${message.text}`}
              $mine={mine}
              $isFirstOfGroup={isFirstOfGroup}
              initial={false}
              animate={
                hasArrived
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 10, scale: 0.96 }
              }
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            >
              {!mine &&
                (isFirstOfGroup ? (
                  <SenderProfile index={senders.indexOf(message.sender)} />
                ) : (
                  <Styled.ProfileSpace />
                ))}
              <Styled.Content $mine={mine}>
                {!mine && isFirstOfGroup && (
                  <Styled.SenderName>{message.sender}</Styled.SenderName>
                )}
                <Styled.BubbleLine>
                  {mine && meta}
                  <Styled.Bubble $mine={mine} $hasTail={isFirstOfGroup}>
                    {message.text}
                  </Styled.Bubble>
                  {!mine && meta}
                </Styled.BubbleLine>
              </Styled.Content>
            </Styled.Row>
          );
        })}
      </Styled.Body>

      <Styled.InputBar aria-hidden='true'>
        <Styled.InputIcon>
          <PlusIcon />
        </Styled.InputIcon>
        <Styled.InputField />
        <Styled.InputIcon>
          <SmileIcon />
        </Styled.InputIcon>
        <Styled.InputIcon>
          <HashIcon />
        </Styled.InputIcon>
      </Styled.InputBar>
    </Styled.Window>
  );
};

export default ChatRoom;
