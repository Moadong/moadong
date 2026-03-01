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
    const id = setInterval(() => setCurrentTime(getNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  return currentTime;
}
