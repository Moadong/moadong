import styled from 'styled-components';

export const SidebarWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;

  width: 168px;
`;

export const SidebarHeader = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0;
  margin-left: 11px;
  margin-bottom: 24px;
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

export const divider = styled.hr`
  width: 100%;
  color: black;
  margin: 14px 0px 29px 0px;
`;

export const SidebarButtonContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8.5px;
  list-style: none;
`;

export const SidebarButton = styled.li`
  cursor: pointer;
  width: 100%;
  height: 37px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 9px 11px;
  transition: background-color 0.1s ease;

  &.active {
    background-color: rgba(255, 84, 20, 0.8);
    color: white;
    font-weight: bold;
  }
`;
