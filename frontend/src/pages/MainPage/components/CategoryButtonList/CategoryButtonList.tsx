import {
  activeCategoryIcons,
  inactiveCategoryIcons,
} from '@/assets/images/icons/category_button';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useSelectedCategory } from '@/store/useCategoryStore';
import { useSearchStore } from '@/store/useSearchStore';
import * as Styled from './CategoryButtonList.styles';

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

interface CategoryButtonListProps {
  /** 목록이 없는 화면(홈)에서 카테고리 선택 후 목록으로 이동시킬 때 사용한다 */
  onSelect?: () => void;
  /** 목록을 필터링하는 화면에서만 스크롤 시 상단에 고정한다 */
  sticky?: boolean;
}

const CategoryButtonList = ({
  onSelect,
  sticky = true,
}: CategoryButtonListProps) => {
  const { selectedCategory, setSelectedCategory } = useSelectedCategory();
  const trackEvent = useMixpanelTrack();

  const handleCategoryClick = (category: Category) => {
    trackEvent(USER_EVENT.CATEGORY_BUTTON_CLICKED, {
      category_id: category.id,
      category_name: category.name,
    });

    const { resetSearch } = useSearchStore.getState();
    resetSearch();

    setSelectedCategory(category.id);
    onSelect?.();
  };

  return (
    <Styled.CategoryButtonContainer $sticky={sticky}>
      {clubCategories.map((category) => (
        <Styled.CategoryButton
          key={category.id}
          onClick={() => handleCategoryClick(category)}
        >
          <img
            src={
              selectedCategory === category.id
                ? activeCategoryIcons[category.type]
                : inactiveCategoryIcons[category.type]
            }
            alt={category.name}
          />
          <span>{category.name}</span>
        </Styled.CategoryButton>
      ))}
    </Styled.CategoryButtonContainer>
  );
};

export default CategoryButtonList;
