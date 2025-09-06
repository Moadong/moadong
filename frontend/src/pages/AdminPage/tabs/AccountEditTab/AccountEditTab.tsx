// AccountEditTab.tsx

import React, { useState, useMemo } from 'react';
import * as Styled from './AccountEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import Button from '@/components/common/Button/Button';
import { changePassword } from '@/apis/auth/changePassword';

// 비밀번호 유효성 검사를 위한 정규식
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^])(?!.*\s).{8,20}$/;

const AccountEditTab = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. 새 비밀번호의 유효성을 실시간으로 검사
  const isPasswordValid = useMemo(() => {
    if (newPassword.length === 0) return null; // 입력이 없으면 판별 안함
    return PASSWORD_REGEX.test(newPassword);
  }, [newPassword]);

  // 2. 비밀번호 확인 필드의 일치 여부 검사
  const isPasswordMatching = useMemo(() => {
    if (confirmPassword.length === 0) return null;
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    setSuccessMessage('');

    // 3. 버튼 클릭 시 모든 유효성 검사 실행
    if (!newPassword || !confirmPassword) {
      alert('새 비밀번호와 확인 필드를 모두 입력해주세요.');
      return;
    }
    if (isPasswordValid !== true) {
      alert('비밀번호가 정책에 맞지 않습니다. (영문, 숫자, 특수문자 포함 8~20자)');
      return;
    }
    if (isPasswordMatching !== true) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changePassword({ password: newPassword });
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <h1>비밀번호 수정</h1>
      
      {/* 4. 새로 만든 스타일 컴포넌트로 안내 문구 표시 */}
      <br />
      <Styled.GuidanceBox>
        <Styled.GuidanceText>
          비밀번호는 영문, 숫자, 특수문자(!@#$%^)를 포함하여 8자 이상 20자 이하로 입력해야 합니다.
        </Styled.GuidanceText>
        <Styled.GuidanceText>
          비밀번호를 잊으신 경우 모아동 관리자에게 연락 주세요.
        </Styled.GuidanceText>
      </Styled.GuidanceBox>

      {/* 5. InputField에 유효성 검사 결과 전달 */}
      <InputField
        placeholder='새 비밀번호'
        type='password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        onClear={() => setNewPassword('')}
        maxLength={20}
        isError={isPasswordValid === false}
        isSuccess={isPasswordValid === true}
        helperText={isPasswordValid === false ? '영문, 숫자, 특수문자 포함 8~20자' : ''}
      />
      <br />

      <InputField
        placeholder='새 비밀번호 재입력'
        type='password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onClear={() => setConfirmPassword('')}
        maxLength={20}
        isError={isPasswordMatching === false}
        isSuccess={isPasswordMatching === true}
        helperText={isPasswordMatching === false ? '비밀번호가 일치하지 않습니다.' : ''}
      />
      <br />

      {successMessage && <Styled.SuccessMessage>{successMessage}</Styled.SuccessMessage>}
      <br />

      <Button width={'100%'} animated onClick={handleChangePassword}>
        비밀번호 변경하기
      </Button>
    </div>
  );
};

export default AccountEditTab;
