import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import { setTypography } from '@/styles/theme/typography';

export const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0 40px;
`;

export const Lead = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const Detail = styled.section<{ $back: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
  border-radius: 24px;
  background: ${({ $back }) => $back};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 8px;
`;

export const Body = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[800]};
  word-break: keep-all;
`;

/** 앱의 지원하기 버튼과 같은 공통 Button. 부스용으로 높이·글자만 키운다 */
export const RetryButton = styled(Button)`
  width: 100%;
  height: 64px;
  margin-top: 12px;
  border-radius: 16px;
  ${({ theme }) => setTypography(theme.typography.title.title5)};
`;

export const SubLine = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const QrBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.base.white};
`;

export const QrCaption = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: center;
`;

/** 공통 Button의 보조 스타일. 채움 대신 회색 테두리 */
export const ShareButton = styled(Button)`
  width: 100%;
  height: 64px;
  margin-top: 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.base.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  ${({ theme }) => setTypography(theme.typography.title.title5)};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

/** 공유하기 보조 스타일에서 높이·글자만 줄인다 */
export const StudentToggle = styled(ShareButton)`
  height: 56px;
  margin-top: 16px;
  ${({ theme }) => setTypography(theme.typography.title.title6)};
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const Chip = styled.span<{ $main: string }>`
  padding: 6px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ $main }) => $main};
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
`;

export const ActionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 20px;
`;

export const ActionItem = styled.li`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[800]};
  word-break: keep-all;
`;

/** 상세 탑바와 같은 둥근 셰브론(chevron_right_small). 오른쪽 화살표라 90도 돌려 쓰고 열리면 반대로 */
export const ToggleIcon = styled.img<{ $open: boolean }>`
  width: 8px;
  height: 13px;
  margin-left: 10px;
  transform: rotate(${({ $open }) => ($open ? -90 : 90)}deg);
  transition: transform ${({ theme }) => theme.transitions.duration.fast};
`;

export const StudentPanel = styled.section<{ $back: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 8px;
  padding: 24px;
  border-radius: 16px;
  background: ${({ $back }) => $back};
`;

export const Credit = styled.p`
  margin-top: 20px;
  text-align: center;
  ${({ theme }) => setTypography(theme.typography.paragraph.p7)};
  color: ${({ theme }) => theme.colors.gray[500]};

  a {
    color: inherit;
    text-decoration: underline;
  }
`;
