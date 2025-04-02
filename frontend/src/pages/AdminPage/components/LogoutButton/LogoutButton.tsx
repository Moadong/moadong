import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/admin/login', { replace: true });
  };

  return (
    <Button width={'100%'} onClick={handleLogout} animated={true}>
      로그아웃
    </Button>
  );
};

export default LogoutButton;
