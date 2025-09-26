import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './CategoryButtonList.styles';
import { inactiveCategoryIcons, activeCategoryIcons } from '@/assets/images/icons/category_button';
import { useSearchStore } from '@/store/useSearchStore';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { EVENT_NAME } from '@/constants/eventName';

interface Category {
  id: string;
  name: string;
  type: string;
}

const clubCategories: Category[] = [
  { id: 'all', name: '전체', type: 'all' },
  { id: '봉사', name: '봉사', type: 'volunteer' },
  { id: '종교', name: '종교', type: 'religion' },
  { id: '취미교양', name: '취미교양', type: 'hobby' },
  { id: '학술', name: '학술', type: 'study' },
  { id: '운동', name: '운동', type: 'sport' },
  { id: '공연', name: '공연', type: 'performance' },
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
          <img src={selectedCategory === category.id ? 
            activeCategoryIcons[category.type] : inactiveCategoryIcons[category.type]} 
            alt={category.name} 
          />
          <span>{category.name}</span>
        </Styled.CategoryButton>
      ))}
    </Styled.CategoryButtonContainer>
  );
};

export default CategoryButtonList;
