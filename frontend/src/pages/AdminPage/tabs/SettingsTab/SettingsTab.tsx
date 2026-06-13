import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { logout } from '@/apis/auth';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { ADMIN_TABS } from '@/constants/adminTabs';
import SettingsCard from './components/SettingsCard';
import * as Styled from './SettingsTab.styles';

const SettingsTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const trackEvent = useMixpanelTrack();

  const handleItemClick = (label: string, path: string) => {
    trackEvent(ADMIN_EVENT.TAB_CLICKED, { tabName: label });
    queryClient.invalidateQueries();
    navigate(path);
  };

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

  const handleNavigateToMain = () => {
    navigate('/');
  };

  return (
    <Styled.Container>
      <Styled.PageHeader>
        <Styled.AdminIcon />
        <Styled.PageTitle>설정</Styled.PageTitle>
      </Styled.PageHeader>

      <Styled.CardList>
        {ADMIN_TABS.map((tab) => (
          <SettingsCard
            key={tab.category}
            category={tab.category}
            items={tab.items.map((item) => ({
              label: item.label,
              onClick: () => handleItemClick(item.label, item.path),
            }))}
          />
        ))}
      </Styled.CardList>

      <Styled.ButtonSection>
        <Styled.LogoutButton onClick={handleLogout}>로그아웃</Styled.LogoutButton>
        <Styled.NavigateButton onClick={handleNavigateToMain}>
          <Styled.NavigateButtonLabel>모아동으로 이동</Styled.NavigateButtonLabel>
          <Styled.RightArrowIcon />
        </Styled.NavigateButton>
      </Styled.ButtonSection>
    </Styled.Container>
  );
};

export default SettingsTab;
