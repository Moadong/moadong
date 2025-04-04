import React from 'react';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import styled from 'styled-components';

interface ButtonProps {
  onClick?: () => void;
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  background-color: #3a3a3a;
  color: white;
  font-weight: bold;

  width: 148px;
  height: 44px;
  font-size: 1.25rem;

  &:hover {
    background-color: #555;
    transform: scale(1.03);
  }

  @media (max-width: 500px) {
    width: 256px;
    height: 44px;
    font-size: 1rem;
  }
`;

const ClubApplyButton = ({ onClick }: ButtonProps) => {
  const trackEvent = useMixpanelTrack();

  const handleClick = () => {
    trackEvent('Club Apply Button Clicked');

    if (onClick) {
      onClick();
    }
    // []FIXME: 모집 마감 시 alert창 띄우기
    alert('모집이 마감되었습니다. 다음에 지원해 주세요.');
  };

  return <Button onClick={handleClick}>지원하기</Button>;
};

export default ClubApplyButton;
