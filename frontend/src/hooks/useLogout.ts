import { useNavigate } from 'react-router-dom';
import { logout } from '@/apis/auth';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';

const useLogout = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (!confirmed) return;

    try {
      await logout();
      trackEvent(ADMIN_EVENT.LOGOUT_BUTTON_CLICKED);
      localStorage.removeItem('accessToken');
      navigate('/admin/login', { replace: true });
    } catch {
      alert('로그아웃에 실패했습니다.');
    }
  };

  return { handleLogout };
};

export default useLogout;
