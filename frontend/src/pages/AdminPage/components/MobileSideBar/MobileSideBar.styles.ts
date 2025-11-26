import styled from 'styled-components';

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

export const SidebarWrapper = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: white;
  z-index: 1000;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
`;

export const ClubInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const ClubLogo = styled.img`
  width: 100px;
  height: 100px;
  background: #ededed;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const ClubTitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const Divider = styled.hr`
  width: 100%;
  border: 1px solid;
  color: #c5c5c5;
  height: 0;
  margin: 16px 0px 16px 0px;
`;

export const SidebarButtonContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  padding: 0;
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
