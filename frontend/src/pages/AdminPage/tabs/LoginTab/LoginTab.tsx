// Login.tsx
import React, { useState } from 'react';
import * as Styled from './LoginTab.styles';
import InputField from '@/components/common/InputField/InputField';
import Button from '@/components/common/Button/Button';
import moadong_name_logo from '@/assets/images/moadong_name_logo.svg';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    console.log('로그인 시도:', { username, password });
  };

  return (
    <Styled.LoginContainer>
      <Styled.LoginBox>
        <Styled.Logo src={moadong_name_logo} alt='Moadong Logo' />
        <Styled.Title>Log in</Styled.Title>

        <Styled.InputFieldsContainer>
          <InputField
            type='text'
            placeholder='아이디'
            showClearButton={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type='password'
            placeholder='비밀번호'
            showClearButton={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Styled.InputFieldsContainer>

        <Styled.ButtonWrapper>
          <Button width='100%' onClick={handleLogin}>
            로그인
          </Button>
        </Styled.ButtonWrapper>

        <Styled.ForgotLinks>
          <a href='#signup'>회원가입</a>
          <span>|</span>
          <a href='#find-id'>아이디 찾기</a>
          <span>|</span>
          <a href='#find-pw'>비밀번호 찾기</a>
        </Styled.ForgotLinks>
      </Styled.LoginBox>
    </Styled.LoginContainer>
  );
};

export default Login;
