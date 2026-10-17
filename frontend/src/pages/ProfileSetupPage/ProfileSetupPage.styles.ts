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

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

export const ProfileImageButton = styled.button`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
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

export const ProfileImageEditIcon = styled.div`
  position: absolute;
  right: -14px;
  bottom: -10px;
  width: 36px;
  height: 36px;

  svg {
    width: 36px;
    height: 36px;
  }
`;

export const ProfileImageCaption = styled.p`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
  margin: 12px 0 0;
`;

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
  font-weight: 600;
  color: ${colors.gray[800]};
`;

export const NicknameCharCount = styled.span`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
`;

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

export const HintSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HintText = styled.p`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[600]};
  margin: 0;
`;

export const SuggestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
`;

export const SuggestionTitle = styled.p`
  ${setTypography(typography.paragraph.p5)}
  font-weight: 600;
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

export const DesktopWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - ${HEADER_HEIGHT.desktop}px);
  margin-top: ${HEADER_HEIGHT.desktop}px;
  background: ${colors.gray[100]};
  padding: 40px 20px 60px;
`;

export const DesktopCard = styled.div`
  width: 100%;
  max-width: 960px;
  background: ${colors.base.white};
  border-radius: 16px;
  padding: 54px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const DesktopCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const DesktopHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DesktopCardTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.base.black};
  margin: 0 0 6px;
  letter-spacing: 0;
`;

export const DesktopCardSubtitle = styled.p`
  ${setTypography(typography.paragraph.p6)}
  color: ${colors.gray[600]};
  margin: 0;
`;

export const DesktopSaveButton = styled(Button)`
  flex-shrink: 0;
  width: 150px;
`;

export const DesktopSection = styled.div``;

export const DesktopSectionTitle = styled.h2`
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
  margin: 0 0 16px;
`;

export const DesktopProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const DesktopProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  border: 0.5px solid ${colors.gray[500]};
  background: #ededed;
  object-fit: cover;
  flex-shrink: 0;
`;

export const DesktopProfileRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DesktopProfileButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const DesktopProfileCaption = styled.p`
  ${setTypography(typography.paragraph.p7)}
  color: ${colors.gray[500]};
  margin: 0;
`;

export const DesktopNicknameSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
`;

export const DesktopHintCharRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
