import { colors } from '@/styles/theme/colors';

// 동아리 태그별 색상 매핑
export const TAG_COLORS: Record<string, string> = {
  중동: 'rgba(230, 247, 255, 1)',
  과동: 'rgba(210, 230, 255, 1)',
  자유: 'rgba(237, 237, 237, 0.8)',
  봉사: colors.secondary[1].tag,
  종교: colors.secondary[2].tag,
  취미교양: colors.secondary[3].tag,
  학술: colors.secondary[4].tag,
  운동: colors.secondary[5].tag,
  공연: colors.secondary[6].tag,
};

// 모집 상태별 색상 매핑
export const STATUS_COLORS: Record<string, string> = {
  모집중: colors.accent[1][900],
  모집마감: colors.gray[500],
  상시모집: colors.accent[2][900],
  모집예정: colors.accent[1][900],
};
