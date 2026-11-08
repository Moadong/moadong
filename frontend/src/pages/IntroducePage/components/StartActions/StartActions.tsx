// 대상별 시작 버튼: 학생은 앱 다운로드(PC는 설치 QR)·웹으로 보기, 운영진은 관리자 페이지·문의하기
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import moadongMark from '@/assets/images/logos/moadong_mobile_logo.svg';
import useDevice from '@/hooks/useDevice';
import type { Audience } from '@/pages/IntroducePage/constants/audience';
import useAppDownload, {
  AppDownloadLocation,
  getAppDownloadQrUrl,
} from '@/pages/IntroducePage/hooks/useAppDownload';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './StartActions.styles';

const CLUB_CONTACT_LINK = 'https://open.kakao.com/o/s21dRWjh';

const DownloadIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width='18'
    height='18'
    fill='none'
    aria-hidden='true'
  >
    <path
      d='M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width='16'
    height='16'
    fill='none'
    aria-hidden='true'
  >
    <path
      d='M5 12h14m0 0-5-5m5 5-5 5'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width='14'
    height='14'
    fill='none'
    aria-hidden='true'
  >
    <path
      d='M6 6l12 12M18 6 6 18'
      stroke='currentColor'
      strokeWidth='2.2'
      strokeLinecap='round'
    />
  </svg>
);

/** PC에서는 폰으로 찍을 설치 QR 카드를 버튼 아래에 띄운다 (토스 홈 앱 다운로드와 같은 방식) */
const DesktopDownload = ({ location }: { location: AppDownloadLocation }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const download = useAppDownload(location);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <Styled.DownloadAnchor ref={rootRef}>
      <Styled.Primary
        aria-expanded={open}
        aria-haspopup='dialog'
        onClick={() => {
          if (!open) download('qr');
          setOpen((prev) => !prev);
        }}
      >
        <DownloadIcon />앱 다운로드
      </Styled.Primary>
      <AnimatePresence>
        {open && (
          <Styled.QrCard
            role='dialog'
            aria-label='모아동 앱 설치 QR 코드'
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <QRCodeSVG
              value={getAppDownloadQrUrl()}
              size={104}
              level='M'
              imageSettings={{
                src: moadongMark,
                width: 22,
                height: 22,
                excavate: true,
              }}
            />
            <Styled.QrText>
              QR코드를 스캔하면
              <br />
              모아동 앱을 설치할 수 있어요
            </Styled.QrText>
            <Styled.QrClose
              type='button'
              aria-label='닫기'
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </Styled.QrClose>
          </Styled.QrCard>
        )}
      </AnimatePresence>
    </Styled.DownloadAnchor>
  );
};

interface StartActionsProps {
  audience: Audience;
  /** 어느 자리의 버튼인지 (분석 속성) */
  location: AppDownloadLocation;
}

const StartActions = ({ audience, location }: StartActionsProps) => {
  const navigate = useNavigate();
  const openStore = useAppDownload(location);
  const { isDesktop } = useDevice();

  if (audience === 'club') {
    return (
      <Styled.Actions>
        <Styled.Primary onClick={() => navigate('/admin/login')}>
          관리자 페이지 시작하기
          <ArrowIcon />
        </Styled.Primary>
        <Styled.Secondary
          as='a'
          href={CLUB_CONTACT_LINK}
          target='_blank'
          rel='noopener noreferrer'
        >
          등록 문의하기
        </Styled.Secondary>
      </Styled.Actions>
    );
  }

  // 앱 안에서 열었으면 이미 앱이 있으니 웹 이동만 둔다
  if (isInAppWebView()) {
    return (
      <Styled.Actions>
        <Styled.Primary onClick={() => navigate('/')}>
          동아리 보러 가기
          <ArrowIcon />
        </Styled.Primary>
      </Styled.Actions>
    );
  }

  return (
    <Styled.Actions>
      {isDesktop ? (
        <DesktopDownload location={location} />
      ) : (
        <Styled.Primary onClick={() => openStore()}>
          <DownloadIcon />앱 다운로드
        </Styled.Primary>
      )}
      <Styled.Secondary onClick={() => navigate('/')}>
        웹에서 바로 보기
        <ArrowIcon />
      </Styled.Secondary>
    </Styled.Actions>
  );
};

export default StartActions;
