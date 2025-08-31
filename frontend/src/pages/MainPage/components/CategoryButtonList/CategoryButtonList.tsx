import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './CategoryButtonList.styles';
import iconAll from '@/assets/images/icons/category_button/category_all_button_icon.svg';
import iconVolunteer from '@/assets/images/icons/category_button/category_volunteer_button_icon.svg';
import iconReligion from '@/assets/images/icons/category_button/category_religion_button_icon.svg';
import iconHobby from '@/assets/images/icons/category_button/category_hobby_button_icon.svg';
import iconStudy from '@/assets/images/icons/category_button/category_study_button_icon.svg';
import iconSport from '@/assets/images/icons/category_button/category_sport_button_icon.svg';
import iconPerformance from '@/assets/images/icons/category_button/category_performance_button_icon.svg';
import { useSearchStore } from '@/context/useSearchStore';
import { useCategory } from '@/context/CategoryContext';
import { EVENT_NAME } from '@/constants/eventName';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const clubCategories: Category[] = [
  { id: 'all', name: '전체', icon: iconAll },
  { id: '봉사', name: '봉사', icon: iconVolunteer },
  { id: '종교', name: '종교', icon: iconReligion },
  { id: '취미교양', name: '취미교양', icon: iconHobby },
  { id: '학술', name: '학술', icon: iconStudy },
  { id: '운동', name: '운동', icon: iconSport },
  { id: '공연', name: '공연', icon: iconPerformance },
];

const CategoryButtonList = () => {
  const { setSelectedCategory } = useCategory();
  const trackEvent = useMixpanelTrack();

  const handleCategoryClick = (category: Category) => {
    trackEvent(EVENT_NAME.CATEGORY_BUTTON_CLICKED, {
      category_id: category.id,
      category_name: category.name,
    });

    const { setKeyword, setInputValue, setIsSearching } =
      useSearchStore.getState();
    setKeyword('');
    setInputValue('');
    setIsSearching(false);

    setSelectedCategory(category.id);
  };

  return (
    <Styled.CategoryButtonContainer>
      {clubCategories.map((category) => (
        <Styled.CategoryButton
          key={category.id}
          onClick={() => handleCategoryClick(category)}
        >
          <img src={category.icon} alt={category.name} />
          <span>{category.name}</span>
        </Styled.CategoryButton>
      ))}
    </Styled.CategoryButtonContainer>
  );
};

export default CategoryButtonList;
