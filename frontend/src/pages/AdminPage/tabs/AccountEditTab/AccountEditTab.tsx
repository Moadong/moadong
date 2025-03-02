import React, { useState } from 'react';
import InputField from '@/components/common/InputField/InputField';

const AccountEditTab = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>계정 정보 수정</h1>

      <InputField
        label='아이디'
        placeholder='아이디를 입력해주세요'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onClear={() => setUsername('')}
        
        maxLength={20}
        disabled={true}
      />

      <InputField
        label='비밀번호'
        placeholder='비밀번호를 입력해주세요'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClear={() => setPassword('')}
        maxLength={20}
        disabled={true}
      />

      <InputField
        label='아이디'
        placeholder='아이디를 입력해주세요'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onClear={() => setUsername('')}
        maxLength={20}
      />

      <InputField
        label='비밀번호'
        placeholder='비밀번호를 입력해주세요'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClear={() => setPassword('')}
        maxLength={20}
      />
    </div>
  );
};

export default AccountEditTab;
