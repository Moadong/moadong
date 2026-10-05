import { useNavigate } from 'react-router-dom';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import InputField from '@/components/common/InputField/InputField';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PASSWORD_MAX } from '@/constants/adminFieldLimits';
import { ADMIN_EVENT, INPUT_FIELD } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
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
              비밀번호는 영문, 숫자, 특수문자(!@#$%^)를 포함하여
              <br />
              8자 이상 20자 이하로 입력해야 합니다.
            </Styled.PageSubtitle>
            <Styled.PageSubtitle>
              비밀번호를 잊으신 경우 모아동 관리자에게 연락 주세요.
            </Styled.PageSubtitle>
          </Styled.PageSubtitleGroup>

          <Styled.FieldList>
            <Styled.FieldWrapper $hasError={isPasswordValid}>
              <InputField
                placeholder='새 비밀번호'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onClear={() => {
                  setNewPassword('');
                  trackEvent(ADMIN_EVENT.INPUT_CLEARED, {
                    field: INPUT_FIELD.NEW_PASSWORD,
                  });
                }}
                maxLength={PASSWORD_MAX}
                isError={isPasswordValid}
                helperText={
                  isPasswordValid ? '영문, 숫자, 특수문자 포함 8~20자' : ''
                }
              />
            </Styled.FieldWrapper>

            <Styled.FieldWrapper $hasError={isPasswordMatching}>
              <InputField
                placeholder='새 비밀번호 재입력'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onClear={() => {
                  setConfirmPassword('');
                  trackEvent(ADMIN_EVENT.INPUT_CLEARED, {
                    field: INPUT_FIELD.CONFIRM_PASSWORD,
                  });
                }}
                maxLength={PASSWORD_MAX}
                isError={isPasswordMatching}
                helperText={
                  isPasswordMatching ? '비밀번호가 일치하지 않습니다.' : ''
                }
              />
            </Styled.FieldWrapper>
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
