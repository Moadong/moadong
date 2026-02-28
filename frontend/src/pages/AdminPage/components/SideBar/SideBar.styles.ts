import styled from 'styled-components';

export const SidebarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 110px;
  width: 190px;
  padding: 12px 10px 10px;
  border-radius: 20px;
  background-color: #ffffff;
  height: fit-content;
`;

export const SidebarHeader = styled.p`
  padding: 0 8px;
  font-size: 1.25rem;
  font-weight: bold;
`;

export const SidebarDivider = styled.hr`
  width: 100%;
  margin: 10px 0 12px;
  border: none;
  border-top: 1px solid #c5c5c5;
`;

export const SidebarButtonContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
`;

export const SidebarCategoryTitle = styled.p`
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #989898;
`;

export const SidebarButton = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.1s ease;

  &.active {
    background-color: rgba(255, 117, 67, 1);
    color: white;
    font-weight: 600;
  }
`;
