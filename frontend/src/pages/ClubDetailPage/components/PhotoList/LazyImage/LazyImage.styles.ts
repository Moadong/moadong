import styled from 'styled-components';

export const ImageContainer = styled.div<{ $isLoaded: boolean; $placeholder: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ $isLoaded, $placeholder }) =>
    $isLoaded ? 'transparent' : $placeholder};
  transition: background-color 0.3s;
`;

export const StyledImage = styled.img<{ $isLoaded: boolean }>`
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
