import { colors } from '@/styles/theme/colors';

// 동아리 태그별 색상 매핑
export const TAG_COLORS: Record<string, string> = {
  중동: 'rgba(230, 247, 255, 1)',
  과동: 'rgba(210, 230, 255, 1)',
  자유: colors.gray[200],
  봉사: colors.secondary[1].tag,
  종교: colors.secondary[2].tag,
  취미교양: colors.secondary[3].tag,
  학술: colors.secondary[4].tag,
  운동: colors.secondary[5].tag,
  공연: colors.secondary[6].tag,
};

// 모집 상태별 배지 면·글자 색. 글자는 면 위 대비 4.5:1 이상
export const STATUS_COLORS: Record<
  string,
  { background: string; text: string }
> = {
  모집중: { background: colors.accent[1][600], text: colors.accent[1][1000] },
  모집마감: { background: colors.gray[200], text: colors.gray[800] },
  상시모집: { background: colors.accent[2][500], text: colors.accent[2][1000] },
  모집예정: { background: colors.accent[1][600], text: colors.accent[1][1000] },
};
