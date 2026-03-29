import { useEffect, useState } from 'react';

function getNow(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function useCurrentTime(): string {
  const [currentTime, setCurrentTime] = useState(getNow);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000;
    const timeoutId = setTimeout(() => {
      setCurrentTime(getNow());
      intervalId = setInterval(() => setCurrentTime(getNow()), 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return currentTime;
}
