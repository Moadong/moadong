import styled from 'styled-components';

export const IdInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ForgotPasswordText = styled.h3`
  color: #cdcdcd;
  font-weight: 300;
  margin-bottom: 5px;
`;

export const SuccessMessage = styled.p`
  color: #28a745; /* 성공을 의미하는 긍정적인 녹색 */
  font-size: 0.9rem; /* 일반 텍스트보다 약간 작게 설정 */
  text-align: left; /* 메시지 좌측 정렬 */
  margin: 8px 0; /* 위아래로 적절한 여백 추가 */
  font-weight: 500; /* 살짝 굵게 하여 가독성 확보 */
`;

export const ErrorMessage = styled.p`
  color: #dc3545; /* 실패를 의미하는 명확한 빨간색 */
  font-size: 0.9rem;
  text-align: left;
  margin: 8px 0;
  font-weight: 500;
`;

export const GuidanceBox = styled.div`
  padding: 16px;
  margin-bottom: 24px; /* 입력 필드와의 간격 */
  background-color: #f8f9fa; /* 부드러운 배경색 */
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid #e9ecef; /* 옅은 테두리 */
`;

export const GuidanceText = styled.p`
  font-size: 0.9rem;
  color: #495057; /* 너무 진하지 않은 회색 텍스트 */
  line-height: 1.5; /* 줄 간격 확보로 가독성 향상 */
  margin: 0; /* 기본 p 태그의 마진 제거 */

  /* 두 번째 p 태그부터는 위에 살짝 여백 추가 */
  & + & {
    margin-top: 8px;
  }
`;
