import styled from 'styled-components';

export const ImageUploadContainer = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  border: 1px dashed #c8c8c8;
  border-radius: 18px;
  cursor: pointer;
  text-align: center;
  line-height: 350px;
  vertical-align: bottom;
  img {
    width: 32px;
    height: 32px;
    display: inline-block;
  }
`;

export const ImageUploadInput = styled.input`
  display: none;
`;
