import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
    </Styled.Container>
  );
};

export default SettingsTab;
