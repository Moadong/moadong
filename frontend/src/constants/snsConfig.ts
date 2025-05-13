export const SNS_CONFIG = {
  instagram: {
    label: '인스타그램',
    placeholder: 'https://www.instagram.com/id',
    regex: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?$/,
  },
  youtube: {
    label: '유튜브',
    placeholder: 'https://www.youtube.com/@id',
    regex: /^https:\/\/(www\.)?youtube\.com\/(channel\/|@)[A-Za-z0-9._%-]+\/?$/,
  },
  x: {
    label: 'X',
    placeholder: 'https://x.com/id',
    regex: /^https:\/\/(www\.)?x\.com\/[A-Za-z0-9._%-]+\/?$/,
  },
} as const;

export type SNSPlatform = keyof typeof SNS_CONFIG;
