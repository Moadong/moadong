import * as Styled from './UnderlineTabs.styles';

export interface UnderlineTabItem {
  key: string;
  label: string;
}

interface UnderlineTabsProps {
  tabs: UnderlineTabItem[];
  activeKey: string;
  onTabClick: (tabKey: string) => void;
  centerOnMobile?: boolean;
  className?: string;
}

const UnderlineTabs = ({
  tabs,
  activeKey,
  onTabClick,
  centerOnMobile = false,
  className,
}: UnderlineTabsProps) => {
  return (
    <Styled.TabList $centerOnMobile={centerOnMobile} className={className}>
      {tabs.map((tab) => (
        <Styled.TabButton
          key={tab.key}
          type='button'
          $active={activeKey === tab.key}
          onClick={() => onTabClick(tab.key)}
        >
          {tab.label}
        </Styled.TabButton>
      ))}
    </Styled.TabList>
  );
};

export default UnderlineTabs;
