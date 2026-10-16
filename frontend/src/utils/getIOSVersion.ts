/**
 * iOS UA에서 OS 버전을 "major.minor" 형식 문자열로 추출
 * 예) "...iPhone OS 17_2 like Mac OS X..." → "17.2"
 */
const getIOSVersion = (
  userAgent: string = navigator.userAgent,
): string | null => {
  if (!/(iPhone|iPad|iPod)/.test(userAgent)) {
    return null;
  }

  const match = userAgent.match(/OS (\d+)[._](\d+)(?:[._](\d+))?/);
  if (!match) {
    return null;
  }

  const [, major, minor] = match;
  return `${major}.${minor}`;
};

export default getIOSVersion;
