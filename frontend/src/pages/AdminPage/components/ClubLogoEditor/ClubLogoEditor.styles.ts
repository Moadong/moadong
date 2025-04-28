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
  background: transparent;
  border: none;
  outline: none;
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
  z-index: 2;
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
    background-color: #f1f1f1;
  }

  img {
    width: 15px;
    height: 15px;
  }
`;

export const Divider = styled.div`
  width: 90%;
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
  margin: 0 auto;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
