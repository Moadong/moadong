import { useLocation, useNavigate } from 'react-router-dom';
import useDevice from '@/hooks/useDevice';
import * as Styled from './Filter.styles';

const FILTER_OPTIONS = [
  { label: '동아리', path: '/' },
  { label: '홍보', path: '/promotion' },
] as const;

const Filter = () => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      {isMobile && (
        <Styled.FilterListContainer>
          {FILTER_OPTIONS.map((filter) => (
            <Styled.FilterButton
              key={filter.path}
              $isActive={pathname === filter.path}
              onClick={() => navigate(filter.path)}
            >
              {filter.label}
            </Styled.FilterButton>
          ))}
        </Styled.FilterListContainer>
      )}
    </>
  );
};

export default Filter;
