import mixpanel from 'mixpanel-browser';
import * as Styled from './CategoryButtonList.styles';
import iconAll from '@/assets/images/icons/category_button/category_all_button_icon.svg';
import iconVolunteer from '@/assets/images/icons/category_button/category_volunteer_button_icon.svg';
import iconReligion from '@/assets/images/icons/category_button/category_religion_button_icon.svg';
import iconHobby from '@/assets/images/icons/category_button/category_hobby_button_icon.svg';
import iconStudy from '@/assets/images/icons/category_button/category_study_button_icon.svg';
import iconSport from '@/assets/images/icons/category_button/category_sport_button_icon.svg';
import iconPerformance from '@/assets/images/icons/category_button/category_performance_button_icon.svg';
import { useSearch } from '@/context/SearchContext';

interface Category {
  id: string;
  name: string;
  icon: string;
  eventName: string;
}

interface CategoryButtonListProps {
  onCategorySelect: (division: string) => void;
}

const clubCategories: Category[] = [
  { id: 'all', name: '전체', icon: iconAll, eventName: 'Category_All_Clicked' },
  {
    id: '봉사',
    name: '봉사',
    icon: iconVolunteer,
    eventName: 'Category_Volunteering_Clicked',
  },
  {
    id: '종교',
    name: '종교',
    icon: iconReligion,
    eventName: 'Category_Religion_Clicked',
  },
  {
    id: '취미교양',
    name: '취미교양',
    icon: iconHobby,
    eventName: 'Category_Hobby_Clicked',
  },
  {
    id: '학술',
    name: '학술',
    icon: iconStudy,
    eventName: 'Category_Study_Clicked',
  },
  {
    id: '운동',
    name: '운동',
    icon: iconSport,
    eventName: 'Category_Sport_Clicked',
  },
  {
    id: '공연',
    name: '공연',
    icon: iconPerformance,
    eventName: 'Category_Performance_Clicked',
  },
];

const CategoryButtonList = ({ onCategorySelect }: CategoryButtonListProps) => {
  const { setKeyword, setInputValue } = useSearch();

  const handleCategoryClick = (category: Category) => {
    mixpanel.track(category.eventName, {
      category_id: category.id,
      category_name: category.name,
      timestamp: Date.now(),
      url: window.location.href,
    });

    setKeyword('');
    setInputValue('');

    onCategorySelect(category.id);
  };

  return (
    <Styled.CategoryButtonContainer>
      {clubCategories.map((category) => (
        <Styled.CategoryButton
          key={category.id}
          onClick={() => handleCategoryClick(category)}>
          <img src={category.icon} alt={category.name} />
          <span>{category.name}</span>
        </Styled.CategoryButton>
      ))}
    </Styled.CategoryButtonContainer>
  );
};

export default CategoryButtonList;
