declare global {
  interface Window {
    Kakao: any;
    naver: any;
    navermap_authFailure: () => void;
  }
}

export {};
