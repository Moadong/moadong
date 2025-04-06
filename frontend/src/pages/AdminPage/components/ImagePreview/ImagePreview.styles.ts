import styled from 'styled-components';

export const ImagePreviewContainer = styled.div`
  display: inline-block;
  width: 350px;
  height: 350px;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  margin-right: 20px;
  img {
    width: 100%;
    height: 100%;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  cursor: pointer;
  background-color: transparent;

  img {
    width: 32px;
    height: 32px;
  }

  &:hover {
    opacity: 0.8;
  }
`;
