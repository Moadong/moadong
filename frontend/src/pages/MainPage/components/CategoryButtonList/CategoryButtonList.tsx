import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './CategoryButtonList.styles';
import iconAll from '@/assets/images/icons/category_button/category_all_button_icon.svg';
import iconVolunteer from '@/assets/images/icons/category_button/category_volunteer_button_icon.svg';
import iconReligion from '@/assets/images/icons/category_button/category_religion_button_icon.svg';
import iconHobby from '@/assets/images/icons/category_button/category_hobby_button_icon.svg';
import iconStudy from '@/assets/images/icons/category_button/category_study_button_icon.svg';
import iconSport from '@/assets/images/icons/category_button/category_sport_button_icon.svg';
import iconPerformance from '@/assets/images/icons/category_button/category_performance_button_icon.svg';
import iconAllActive from '@/assets/images/icons/category_button/category_all_button_icon_active.svg';
import iconVolunteerActive from '@/assets/images/icons/category_button/category_volunteer_button_icon_active.svg';
import iconReligionActive from '@/assets/images/icons/category_button/category_religion_button_icon_active.svg';
import iconHobbyActive from '@/assets/images/icons/category_button/category_hobby_button_icon_active.svg';
import iconStudyActive from '@/assets/images/icons/category_button/category_study_button_icon_active.svg';
import iconSportActive from '@/assets/images/icons/category_button/category_sport_button_icon_active.svg';
import iconPerformanceActive from '@/assets/images/icons/category_button/category_performance_button_icon_active.svg';
import { useSearchStore } from '@/store/useSearchStore';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { EVENT_NAME } from '@/constants/eventName';

interface Category {
  id: string;
  name: string;
  icon: string;
  activeIcon: string
}

const clubCategories: Category[] = [
  { id: 'all', name: '전체', icon: iconAll, activeIcon: iconAllActive },
  { id: '봉사', name: '봉사', icon: iconVolunteer, activeIcon: iconVolunteerActive },
  { id: '종교', name: '종교', icon: iconReligion, activeIcon: iconReligionActive },
  { id: '취미교양', name: '취미교양', icon: iconHobby, activeIcon: iconHobbyActive },
  { id: '학술', name: '학술', icon: iconStudy, activeIcon: iconStudyActive },
  { id: '운동', name: '운동', icon: iconSport, activeIcon: iconSportActive },
  { id: '공연', name: '공연', icon: iconPerformance, activeIcon: iconPerformanceActive },
];

const CategoryButtonList = () => {
  const { selectedCategory, setSelectedCategory } = useSelectedCategory();
  const trackEvent = useMixpanelTrack();

  const handleCategoryClick = (category: Category) => {
    trackEvent(EVENT_NAME.CATEGORY_BUTTON_CLICKED, {
      category_id: category.id,
      category_name: category.name,
    });

    const { resetSearch } = useSearchStore.getState();
    resetSearch();

    setSelectedCategory(category.id);
  };

  return (
    <Styled.CategoryButtonContainer>
      {clubCategories.map((category) => (
        <Styled.CategoryButton
          key={category.id}
          onClick={() => handleCategoryClick(category)}
        >
          <img src={selectedCategory === category.id ? category.activeIcon : category.icon} alt={category.name} />
          <span>{category.name}</span>
        </Styled.CategoryButton>
      ))}
    </Styled.CategoryButtonContainer>
  );
};

export default CategoryButtonList;
