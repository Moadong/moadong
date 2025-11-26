import React from 'react';
import * as Styled from './AccountEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import Button from '@/components/common/Button/Button';
import { ADMIN_EVENT } from '@/constants/eventName';

interface AccountEditTabProps {
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  successMessage: string;
  isLoading: boolean;
  isPasswordValid: boolean;
  isPasswordMatching: boolean;
  handleChangePassword: () => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const DesktopAccountEditTab = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  successMessage,
  isLoading,
  isPasswordValid,
  isPasswordMatching,
  handleChangePassword,
  trackEvent,
}: AccountEditTabProps) => {
  return (
    <div>
      <h1>비밀번호 수정</h1>
      <br />
      <Styled.GuidanceBox>
        <Styled.GuidanceText>
          비밀번호는 영문, 숫자, 특수문자(!@#$%^)를 포함하여 8자 이상 20자
          이하로 입력해야 합니다.
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

      {successMessage && (
        <Styled.SuccessMessage>{successMessage}</Styled.SuccessMessage>
      )}
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

export default DesktopAccountEditTab;
