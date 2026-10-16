import { useEffect } from 'react';

/**
 * 열린 오버레이 수를 세어 body 스크롤을 잠근다.
 *
 * 모달 안에서 시트를 여는 것처럼 오버레이가 겹칠 때, 안쪽이 닫히면서 잠금을
 * 풀어버리면 바깥이 아직 열려 있는데 배경이 스크롤되고 맨 위로 튄다.
 * 그래서 첫 잠금에서만 스크롤 위치를 저장하고, 마지막 해제에서만 되돌린다.
 */
let lockCount = 0;
let savedScrollY = 0;

const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = '100%';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollY);
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
