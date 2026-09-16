import { STORAGE_KEYS } from '@/constants/storageKeys';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createUuid = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

/** localStorage를 쓸 수 없으면 익명 설문을 열지 않는다. */
export const getFeedbackAnonymousClientId = (): string | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK_PROMPT_ANONYMOUS_ID);
    if (saved && UUID_PATTERN.test(saved)) return saved;
    const id = createUuid();
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_PROMPT_ANONYMOUS_ID, id);
    return localStorage.getItem(STORAGE_KEYS.FEEDBACK_PROMPT_ANONYMOUS_ID) === id
      ? id
      : null;
  } catch {
    return null;
  }
};
