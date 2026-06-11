import UnderlineTabs from '@/components/common/UnderlineTabs/UnderlineTabs';
import type { FestivalDay } from '../../data/buskingDays';

interface DayTabsNavProps {
  days: FestivalDay[];
  activeDayId: string;
  onChange: (dayId: string) => void;
}

const DayTabsNav = ({ days, activeDayId, onChange }: DayTabsNavProps) => (
  <UnderlineTabs
    tabs={days.map((day) => ({ key: day.id, label: day.label }))}
    activeKey={activeDayId}
    onTabClick={onChange}
    centerOnMobile
  />
);

export default DayTabsNav;
