import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import SettingsCard from './components/SettingsCard';

interface TabItem {
  label: string;
  path: string;
}

interface TabCategory {
  category: string;
  items: TabItem[];
}
import * as Styled from './SettingsTab.styles';

const tabs: TabCategory[] = [
  {
    category: '기본 정보',
    items: [{ label: '메인페이지 정보', path: '/admin/club-info' }],
  },
  {
    category: '모집 정보',
    items: [
      { label: '동아리 상세 정보 수정', path: '/admin/recruit-edit' },
      { label: '활동 사진 수정', path: '/admin/photo-edit' },
    ],
  },
  {
    category: '지원 관리',
    items: [
      { label: '지원서 관리', path: '/admin/application-list' },
      { label: '지원자 현황', path: '/admin/applicants-list' },
    ],
  },
  {
    category: '계정 관리',
    items: [{ label: '아이디/비밀번호 변경', path: '/admin/account-edit' }],
  },
];

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
        {tabs.map((tab) => (
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
