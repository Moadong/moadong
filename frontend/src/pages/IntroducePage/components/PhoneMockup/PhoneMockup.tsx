// 실제 화면 캡처를 밝은 은색 아이폰에 담아 보여주는 목업 (상태바·다이내믹 아일랜드로 세이프 에어리어를 재현하고, 아래는 배경으로 흐려진다)
import { ReactNode } from 'react';
import * as Styled from './PhoneMockup.styles';

const SignalIcon = () => (
  <svg viewBox='0 0 18 12' width='17' height='11' aria-hidden='true'>
    <rect x='0' y='8' width='3' height='4' rx='1' fill='currentColor' />
    <rect x='5' y='5.5' width='3' height='6.5' rx='1' fill='currentColor' />
    <rect x='10' y='3' width='3' height='9' rx='1' fill='currentColor' />
    <rect x='15' y='0' width='3' height='12' rx='1' fill='currentColor' />
  </svg>
);

const WifiIcon = () => (
  <svg viewBox='0 0 16 12' width='15' height='11' aria-hidden='true'>
    <path
      d='M8 2.2c2.4 0 4.6.9 6.2 2.5l1.2-1.3A10.4 10.4 0 0 0 8 .4 10.4 10.4 0 0 0 .6 3.4l1.2 1.3A8.6 8.6 0 0 1 8 2.2Zm0 3.6c1.4 0 2.7.5 3.6 1.4L12.9 6A7 7 0 0 0 8 4a7 7 0 0 0-4.9 2l1.3 1.2A5.1 5.1 0 0 1 8 5.8Zm0 3.6c.5 0 1 .2 1.3.5L8 11.6 6.7 9.9c.3-.3.8-.5 1.3-.5Z'
      fill='currentColor'
    />
  </svg>
);

const BatteryIcon = () => (
  <svg viewBox='0 0 27 13' width='26' height='12' aria-hidden='true'>
    <rect
      x='0.5'
      y='0.5'
      width='22'
      height='12'
      rx='3.5'
      fill='none'
      stroke='currentColor'
      strokeOpacity='0.4'
    />
    <rect x='2' y='2' width='17' height='9' rx='2' fill='currentColor' />
    <path
      d='M24.5 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z'
      fill='currentColor'
      fillOpacity='0.45'
    />
  </svg>
);

interface PhoneMockupProps {
  /** 화면에 넣을 내용 (캡처 이미지나 직접 그린 화면) */
  children: ReactNode;
  /** 상태바 글자색. 어두운 화면(잠금화면 등)이면 light */
  statusTone?: 'dark' | 'light';
  /** 상태바를 화면 위에 겹쳐 띄운다 (잠금화면처럼 배경이 상태바 뒤까지 깔릴 때) */
  overlayStatusBar?: boolean;
  /** 폰을 크게 키우고 위쪽만 보여준다 (작은 글씨가 잘 보이게) */
  zoomed?: boolean;
}

const PhoneMockup = ({
  children,
  statusTone = 'dark',
  overlayStatusBar = false,
  zoomed = false,
}: PhoneMockupProps) => {
  return (
    <Styled.Fade $zoomed={zoomed}>
      <Styled.Body>
        <Styled.SideButton $side='left' $top={120} $height={28} />
        <Styled.SideButton $side='left' $top={170} $height={56} />
        <Styled.SideButton $side='left' $top={238} $height={56} />
        <Styled.SideButton $side='right' $top={190} $height={84} />
        <Styled.Screen>
          <Styled.StatusBar
            aria-hidden='true'
            $tone={statusTone}
            $overlay={overlayStatusBar}
          >
            <Styled.Time>9:41</Styled.Time>
            <Styled.Island />
            <Styled.StatusIcons>
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </Styled.StatusIcons>
          </Styled.StatusBar>
          {children}
        </Styled.Screen>
      </Styled.Body>
    </Styled.Fade>
  );
};

export default PhoneMockup;
