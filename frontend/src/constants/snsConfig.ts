export const SnsConfig = [
  {
    key: 'instagram',
    label: '인스타그램',
    placeholder: 'https://www.instagram.com/id',
  },
  {
    key: 'youtube',
    label: '유튜브',
    placeholder: 'https://www.youtube.com/@id',
  },
  {
    key: 'x',
    label: 'X',
    placeholder: 'https://x.com/id',
  },
] as const;

export type SNSPlatform = (typeof SnsConfig)[number]['key'];

export const SNS_VALIDATION_REGEX: Record<SNSPlatform, RegExp> = {
  instagram: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?$/,
  youtube: /^https:\/\/(www\.)?youtube\.com\/(channel\/|@)[A-Za-z0-9._%-]+\/?$/,
  x: /^https:\/\/(www\.)?x\.com\/[A-Za-z0-9._%-]+\/?$/,
};
