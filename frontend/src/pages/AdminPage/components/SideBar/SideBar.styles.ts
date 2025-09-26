import styled from 'styled-components';

export const SidebarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  width: 168px;
  position: sticky;
  top: 98px;
  height: fit-content;
`;

export const SidebarHeader = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0;
  margin-left: 11px;
  margin-bottom: 19px;
`;

export const ClubLogo = styled.img`
  width: 168px;
  height: 168px;
  background: #ededed;
  border-radius: 10px;
`;

export const ClubTitle = styled.p`
  text-align: center;
  margin-top: 14px;
  font-size: 2rem;
  font-weight: bold;
  height: 76px;
  max-width: 163px;
`;

export const Divider = styled.hr`
  width: 100%;
  border: 1px solid;
  color: #C5C5C5;
  height: 0;
  margin: 16px 0px 16px 0px;
`;

export const SidebarButtonContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
`;

export const SidebarCategoryTitle = styled.p`
  align-items: center;
  padding: 6px 0px 6px 10px;
  font-size: 0.75rem;
  font-weight: medium;
  color: #989898;
`;

export const SidebarButton = styled.button`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;

  width: 100%;
  height: 37px;
  border-radius: 10px;

  padding-left: 10px;

  font-size: 1rem;
  font-weight: medium;

  transition: background-color 0.1s ease;

  &.active {
    background-color: rgba(255, 117, 67, 1);
    color: white;
    font-weight: medium;
  }
`;

