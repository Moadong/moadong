import React, { useState } from 'react';
import * as Styled from './AccountEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import Button from '@/components/common/Button/Button';

const AccountEditTab = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>계정 정보 수정</h1>
      <br />
      <br />
      <Styled.IdInputContainer>
        <InputField
          label='아이디'
          placeholder='아이디를 입력해주세요'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onClear={() => setUsername('')}
          maxLength={20}
          disabled={true}
        />
        <Button width={'150px'} animated onClick={() => alert('수정 완료')}>
          변경
        </Button>
      </Styled.IdInputContainer>
      <br />

      <InputField
        placeholder='새 비밀번호'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onClear={() => setUsername('')}
        maxLength={20}
      />
      <br />

      <InputField
        placeholder='새 비밀번호 재입력'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClear={() => setPassword('')}
        maxLength={20}
      />
      <br />

      <Styled.ForgotPasswordText>
        비밀번호를 잊으셨나요?
      </Styled.ForgotPasswordText>
      <Button width={'100%'} animated onClick={() => alert('수정 완료')}>
        비밀번호 변경하기
      </Button>
    </div>
  );
};

export default AccountEditTab;
