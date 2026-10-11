import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  min-height: calc(100dvh - 48px);
  margin: 0 auto;
  padding: 32px 20px calc(80px + env(safe-area-inset-bottom) + 20px);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    box-shadow: none;
  }
`;

export const DesktopWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - ${HEADER_HEIGHT.desktop}px);
  margin-top: ${HEADER_HEIGHT.desktop}px;
  background: ${colors.base.white};
  padding: 40px 0 60px;

  ${media.laptop} {
    padding: 32px 20px 48px;
  }
`;

export const DesktopCard = styled.div`
  width: 100%;
  max-width: 480px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 16px;
  padding: 40px 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* 모바일 설명 영역 */
export const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

export const PageTitle = styled.h2`
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
  margin: 0;
  word-break: keep-all;
`;

export const PageTitleHighlight = styled.span`
  color: ${colors.primary[900]};
`;

export const PageSubtitleGroup = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageSubtitle = styled.p`
  ${setTypography(typography.button.button1)}
  color: ${colors.gray[700]};
  margin: 0;
`;

/* 데스크탑 헤더 텍스트 */
export const DesktopTitle = styled.h1`
  ${setTypography(typography.title.title1)}
  color: ${colors.base.black};
  text-align: center;
  letter-spacing: -0.8px;
  margin: 0 0 12px;
`;

export const DesktopSubtitle = styled.p`
  ${setTypography(typography.paragraph.p3)}
  color: ${colors.gray[700]};
  text-align: center;
  margin: 0 0 40px;
`;

/* 프로필 이미지 */
export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
`;

export const ProfileImageBox = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  border: 0.5px solid ${colors.gray[500]};
  box-shadow: 0 0 0 4px ${colors.base.white};
  background: #ededed;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileImageEditButton = styled.button`
  position: absolute;
  right: -12px;
  bottom: -9px;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 32px;
    height: 32px;
  }
`;

export const ProfileImageCaption = styled.p`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
  margin: 12px 0 0;
`;

/* 닉네임 영역 */
export const NicknameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const NicknameLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NicknameLabel = styled.span`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[800]};
`;

export const NicknameCharCount = styled.span`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
`;

/* 랜덤 버튼을 인풋 내부에 올리기 위한 래퍼 */
export const NicknameInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-right: 76px;
  }
`;

export const RegenerateButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  border: none;
  background: ${colors.primary[500]};
  color: ${colors.primary[900]};
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  ${setTypography(typography.button.button1)}
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover {
    background: ${colors.primary[600]};
  }

  &:active {
    background: ${colors.primary[600]};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

/* 힌트 텍스트 */
export const HintSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const HintRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
`;

export const HintIcon = styled.span`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
  flex-shrink: 0;
  line-height: 1.6;
`;

export const HintText = styled.p`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
  margin: 0;
`;

export const HintIndentText = styled.p`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
  margin: 0;
  padding-left: 16px;
`;

/* 추천 닉네임 */
export const SuggestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
`;

export const SuggestionTitle = styled.p`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[800]};
  margin: 0;
`;

export const SuggestionPillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SuggestionPill = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: 100px;
  border: 1px solid ${colors.gray[400]};
  background: ${colors.base.white};
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[800]};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background: ${colors.gray[100]};
  }

  &:active {
    background: ${colors.gray[200]};
  }
`;

/* 데스크탑 저장 버튼 */
export const DesktopSaveButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  margin-top: 40px;
  ${setTypography(typography.paragraph.p2)}
`;
