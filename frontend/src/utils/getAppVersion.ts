const getAppVersion = (): string | null => {
  const match = navigator.userAgent.match(/MoadongApp\/(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
};

export default getAppVersion;
