import { useState } from 'react';
import * as Styled from './AccountEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import Button from '@/components/common/Button/Button';
import { changePassword } from '@/apis/auth/changePassword';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/useTrackPageView';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^])(?!.*\s).{8,20}$/;

const AccountEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.ADMIN_ACCOUNT_EDIT_PAGE);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 1. 로딩 상태 추가

  const isPasswordValid = newPassword.length > 0 && !PASSWORD_REGEX.test(newPassword);

  const isPasswordMatching = confirmPassword.length > 0 && newPassword !== confirmPassword;
  
  const handleChangePassword = async () => {
    if (isLoading) return;

    setSuccessMessage('');

    if (!newPassword || !confirmPassword) {
      alert('새 비밀번호와 확인 필드를 모두 입력해주세요.');
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      alert('비밀번호가 정책에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~20자)');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({ password: newPassword });

      trackEvent(ADMIN_EVENT.PASSWORD_CHANGE_BUTTON_CLICKED, {
        newPasswordLength: newPassword.length,
        confirmPasswordLength: confirmPassword.length,
      });

      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      <h1>비밀번호 수정</h1>
      <br />
      <Styled.GuidanceBox>
        <Styled.GuidanceText>
          비밀번호는 영문, 숫자, 특수문자(!@#$%^)를 포함하여 8자 이상 20자 이하로 입력해야 합니다.
        </Styled.GuidanceText>
        <Styled.GuidanceText>
          비밀번호를 잊으신 경우 모아동 관리자에게 연락 주세요.
        </Styled.GuidanceText>
      </Styled.GuidanceBox>

      <InputField
        placeholder='새 비밀번호'
        type='password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        onClear={() => {
          setNewPassword('');
          trackEvent(ADMIN_EVENT.NEW_PASSWORD_CLEAR_BUTTON_CLICKED);
        }}
        maxLength={20}
        isError={isPasswordValid}
        isSuccess={newPassword.length > 0 && !isPasswordValid}
        helperText={isPasswordValid ? '영문, 숫자, 특수문자 포함 8~20자' : ''}
      />
      <br />

      <InputField
        placeholder='새 비밀번호 재입력'
        type='password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onClear={() => {
          setConfirmPassword('');
          trackEvent(ADMIN_EVENT.CONFIRM_PASSWORD_CLEAR_BUTTON_CLICKED);
        }}
        maxLength={20}
        isError={isPasswordMatching}
        isSuccess={confirmPassword.length > 0 && !isPasswordMatching}
        helperText={isPasswordMatching ? '비밀번호가 일치하지 않습니다.' : ''}
      />
      <br />

      {successMessage && <Styled.SuccessMessage>{successMessage}</Styled.SuccessMessage>}
      <br />

      <Button
        width={'100%'}
        animated
        onClick={handleChangePassword}
        disabled={isLoading}
      >
        {isLoading ? '변경 중...' : '비밀번호 변경하기'}
      </Button>
    </div>
  );
};

export default AccountEditTab;
