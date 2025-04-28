import styled from 'styled-components';

export const ClubLogoWrapper = styled.div`
  position: relative;
  width: 168px;
  height: 168px;
`;

export const ClubLogo = styled.img`
  width: 168px;
  height: 168px;
  background: #ededed;
  border-radius: 10px;
  object-fit: cover;
`;

export const EditButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  padding: 4px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

export const EditMenu = styled.div`
  position: absolute;
  left: 100%;
  transform: translateY(-50%);
  margin-left: 8px;
  background: #fff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.4);
  border-radius: 18px;
  overflow: hidden;
  min-width: 160px;
  z-index: 10;
`;

export const EditMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border: none;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  img {
    width: 18px;
    height: 18px;
  }
`;

export const Divider = styled.div`
  width: 90%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px auto;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
