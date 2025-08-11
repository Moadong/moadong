import youtube_icon from '@/assets/images/icons/sns/youtube_icon.svg';
import instagram_icon from '@/assets/images/icons/sns/instagram_icon.png';
import x_icon from '@/assets/images/icons/sns/x_icon.svg';

export const SNS_CONFIG = {
  instagram: {
    label: '인스타그램',
    placeholder: 'https://www.instagram.com/id',
    // username 뒤에 슬래시 및 쿼리스트링(예: ?igsh=...&utm_source=...) 허용
    regex: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?(\?.*)?$/,
    icon: instagram_icon,
  },
  youtube: {
    label: '유튜브',
    placeholder: 'https://www.youtube.com/@id',
    regex: /^https:\/\/(www\.)?youtube\.com\/(channel\/|@)[A-Za-z0-9._%-]+\/?$/,
    icon: youtube_icon,
  },
  x: {
    label: 'X',
    placeholder: 'https://x.com/id',
    regex: /^https:\/\/(www\.)?x\.com\/[A-Za-z0-9._%-]+\/?$/,
    icon: x_icon,
  },
} as const;
