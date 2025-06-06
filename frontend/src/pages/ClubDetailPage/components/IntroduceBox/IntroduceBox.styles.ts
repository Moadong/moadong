import styled from 'styled-components';

export const IntroduceBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 34px;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  border: 1px solid #dcdcdc;
  padding: 30px;
  gap: 30px;

  @media (max-width: 500px) {
    margin-top: 0;
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #dcdcdc;
    padding: 20px;
    font-size: 14px;
  }
`;

export const IntroduceTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
`;

export const IntroduceContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`;

export const Paragraph = styled.p`
  line-height: 1.6;
  white-space: pre-wrap;
  /* margin-bottom: 16px; */
`;

export const Blockquote = styled.blockquote`
  padding-left: 10px;
  border-left: 4px solid #ccc;
  color: #555;
`;

export const OrderedList = styled.ol`
  padding-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
`;

export const UnorderedList = styled.ul`
  padding-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
`;

export const ListItem = styled.li`
  padding-left: 5px;
  margin-bottom: 4px;
`;
