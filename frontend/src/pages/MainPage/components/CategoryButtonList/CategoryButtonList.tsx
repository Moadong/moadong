import { useEffect, useRef, useState } from 'react';
import {
  activeCategoryIcons,
  inactiveCategoryIcons,
} from '@/assets/images/icons/category_button';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
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
  /** 분과를 고른 뒤 호출한다. 홈은 여기서 목록 처음으로 스크롤한다 */
  onSelect?: () => void;
  /** 목록을 필터링하는 화면에서만, 아이콘 줄이 헤더 아래로 사라지면 모바일 고정 칩 줄을 띄운다 */
  sticky?: boolean;
}

/**
 * 고정 칩 줄이 덮는 영역의 아래 경계(헤더 + 칩 줄). 아이콘 줄의 아래 끝이 이 선보다 위로 올라가면 stuck이다.
 * 목록 앵커가 정확히 이 선에 맞춰 스크롤되면 아이콘 줄 아래 끝도 이 선에 닿는데,
 * 경계에 닿은 상태는 IntersectionObserver가 교차로 보므로 1px 더 아래로 판정선을 둔다.
 */
const STUCK_LINE = HEADER_HEIGHT.mobile + Styled.STUCK_CHIP_BAR_HEIGHT + 1;

const CategoryButtonList = ({
  onSelect,
  sticky = true,
}: CategoryButtonListProps) => {
  const { selectedCategory, setSelectedCategory } = useSelectedCategory();
  const trackEvent = useMixpanelTrack();
  const iconRowRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const iconRow = iconRowRef.current;
    if (!sticky || !iconRow || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(
          !entry.isIntersecting && entry.boundingClientRect.top < STUCK_LINE,
        );
      },
      { rootMargin: `-${STUCK_LINE}px 0px 0px 0px` },
    );
    observer.observe(iconRow);

    return () => observer.disconnect();
  }, [sticky]);

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
    <>
      <Styled.CategoryButtonContainer ref={iconRowRef}>
        {clubCategories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <Styled.CategoryButton
              key={category.id}
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={
                  isActive
                    ? activeCategoryIcons[category.type]
                    : inactiveCategoryIcons[category.type]
                }
                alt=''
              />
              <span>{category.name}</span>
            </Styled.CategoryButton>
          );
        })}
      </Styled.CategoryButtonContainer>

      {sticky && isStuck && (
        <Styled.StuckChipBar>
          {clubCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <Styled.Chip
                key={category.id}
                $active={isActive}
                aria-pressed={isActive}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </Styled.Chip>
            );
          })}
        </Styled.StuckChipBar>
      )}
    </>
  );
};

export default CategoryButtonList;
