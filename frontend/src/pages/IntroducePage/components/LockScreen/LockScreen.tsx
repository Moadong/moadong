// 아이폰 잠금화면에 구독한 동아리의 모아동 알림이 차례로 내려와 쌓이는 장면 (높이 고정이라 알림이 와도 크기가 변하지 않는다)
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import moadong_logo from '@/assets/images/logos/moadong_mobile_logo.svg';
import * as Styled from './LockScreen.styles';

export interface LockScreenNotification {
  id: string;
  title: string;
  body: string;
}

const STEP_MS = 1800;

interface LockScreenProps {
  notifications: LockScreenNotification[];
}

/** 알림을 하나씩 늘리다가 다 보이면 잠깐 멈췄다 처음부터 다시 보여준다 */
const useVisibleCount = (total: number) => {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(
      () => setCount((prev) => (prev >= total ? 0 : prev + 1)),
      count >= total ? STEP_MS * 2 : count === 0 ? 700 : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, count, total]);

  return reduceMotion ? total : count;
};

const LockScreen = ({ notifications }: LockScreenProps) => {
  const visibleCount = useVisibleCount(notifications.length);
  // 최신 알림이 맨 위에 오도록 뒤집어 그린다
  const visible = notifications.slice(0, visibleCount).reverse();

  return (
    <Styled.Wallpaper>
      <Styled.DateText>
        {format(new Date(), 'M월 d일 EEEE', { locale: ko })}
      </Styled.DateText>
      <Styled.Clock>9:41</Styled.Clock>

      <Styled.Stack>
        <AnimatePresence initial={false}>
          {visible.map((notification, index) => (
            <Styled.Notification
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              <Styled.AppIcon>
                <img src={moadong_logo} alt='' />
              </Styled.AppIcon>
              <Styled.NotificationText>
                <Styled.NotificationHead>
                  <Styled.NotificationTitle>
                    {notification.title}
                  </Styled.NotificationTitle>
                  <Styled.NotificationTime>
                    {index === 0 ? '지금' : '1분 전'}
                  </Styled.NotificationTime>
                </Styled.NotificationHead>
                <Styled.NotificationBody>
                  {notification.body}
                </Styled.NotificationBody>
              </Styled.NotificationText>
            </Styled.Notification>
          ))}
        </AnimatePresence>
      </Styled.Stack>
    </Styled.Wallpaper>
  );
};

export default LockScreen;
