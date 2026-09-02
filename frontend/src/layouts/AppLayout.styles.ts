import styled from 'styled-components';

export const Content = styled.div<{ $hasBottomNav: boolean }>`
  padding-bottom: ${({ $hasBottomNav }) =>
    $hasBottomNav ? 'calc(56px + env(safe-area-inset-bottom))' : '0'};
`;
