import { useNavigate } from 'react-router-dom';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PASSWORD_MAX } from '@/constants/adminFieldLimits';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import AdminInputField from '@/pages/AdminPage/components/AdminInputField/AdminInputField';
import * as Styled from './AccountEditTabMobile.styles';

interface AccountEditTabMobileProps {
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isLoading: boolean;
  isPasswordValid: boolean;
  isPasswordMatching: boolean;
  onChangePassword: () => void;
}

const AccountEditTabMobile = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  isPasswordValid,
  isPasswordMatching,
  onChangePassword,
}: AccountEditTabMobileProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar
          title='비밀번호 수정'
          onBack={() => navigate('/admin')}
        />

        <Styled.FormSection>
          <Styled.PageTitle>변경할 비밀번호를 입력해주세요</Styled.PageTitle>
          <Styled.PageSubtitleGroup>
            <Styled.PageSubtitle>
              비밀번호는 영문, 숫자, 특수문자(!@#$%^)를 포함하여 8자 이상 20자
              이하로 입력해야 합니다.
            </Styled.PageSubtitle>
            <Styled.PageSubtitle>
              비밀번호를 잊으신 경우 모아동 관리자에게 연락 주세요.
            </Styled.PageSubtitle>
          </Styled.PageSubtitleGroup>

          <Styled.FieldList>
            <AdminInputField
              placeholder='새 비밀번호'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onClear={() => {
                setNewPassword('');
                trackEvent(ADMIN_EVENT.NEW_PASSWORD_CLEAR_BUTTON_CLICKED);
              }}
              maxLength={PASSWORD_MAX}
              isError={isPasswordValid}
              helperText='영문, 숫자, 특수문자 포함 8~20자'
            />

            <AdminInputField
              placeholder='새 비밀번호 재입력'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onClear={() => {
                setConfirmPassword('');
                trackEvent(ADMIN_EVENT.CONFIRM_PASSWORD_CLEAR_BUTTON_CLICKED);
              }}
              maxLength={PASSWORD_MAX}
              isError={isPasswordMatching}
              helperText='비밀번호가 일치하지 않습니다.'
            />
          </Styled.FieldList>
        </Styled.FormSection>
      </Styled.MobileContainer>

      <FixedBottomButtonArea
        onClick={onChangePassword}
        disabled={
          !newPassword ||
          isPasswordValid ||
          !confirmPassword ||
          isPasswordMatching ||
          isLoading
        }
      >
        비밀번호 변경하기
      </FixedBottomButtonArea>
    </>
  );
};

export default AccountEditTabMobile;
