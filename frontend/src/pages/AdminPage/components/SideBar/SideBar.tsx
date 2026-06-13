import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useLogout from '@/hooks/useLogout';
import { ADMIN_TABS, type TabItem } from '@/constants/adminTabs';
import * as Styled from './SideBar.styles';

const SideBar = () => {
  const queryClient = useQueryClient();
  const trackEvent = useMixpanelTrack();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  const activeTab = useMemo(() => {
    return ADMIN_TABS.map((tab) =>
      tab.items.findIndex((item) => location.pathname.startsWith(item.path)),
    );
  }, [location.pathname]);

  const handleTabClick = (item: TabItem) => {
    trackEvent(ADMIN_EVENT.TAB_CLICKED, {
      tabName: item.label,
    });
    queryClient.invalidateQueries();
    navigate(item.path);
  };

  return (
    <Styled.SidebarWrapper>
      <Styled.SidebarHeader>설정</Styled.SidebarHeader>
      <Styled.SidebarDivider />

      <Styled.SidebarButtonContainer>
        {ADMIN_TABS.map((tab, tabIndex) => (
          <li key={tab.category}>
            <Styled.SidebarCategoryTitle>
              {tab.category}
            </Styled.SidebarCategoryTitle>
            {tab.items.map((item, itemIndex) => (
              <Styled.SidebarButton
                key={item.label}
                className={activeTab[tabIndex] === itemIndex ? 'active' : ''}
                onClick={() => handleTabClick(item)}
              >
                {item.label}
              </Styled.SidebarButton>
            ))}
          </li>
        ))}
      </Styled.SidebarButtonContainer>
      <Styled.SidebarDivider />
      <Styled.SidebarButton onClick={handleLogout}>
        로그아웃
      </Styled.SidebarButton>
    </Styled.SidebarWrapper>
  );
};

export default SideBar;
