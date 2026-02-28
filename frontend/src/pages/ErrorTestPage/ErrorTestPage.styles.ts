import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[300]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.title.title1.size};
  font-weight: ${({ theme }) => theme.typography.title.title1.weight};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 12px;
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.paragraph.p3.size};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.6;
`;

export const Section = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.title.title5.size};
  font-weight: ${({ theme }) => theme.typography.title.title5.weight};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 8px;
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.paragraph.p5.size};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
  margin-bottom: 16px;
`;

interface TestButtonProps {
  $variant: 'danger' | 'warning' | 'info';
}

export const TestButton = styled.button<TestButtonProps>`
  width: 100%;
  padding: 16px 24px;
  font-size: ${({ theme }) => theme.typography.paragraph.p3.size};
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'danger':
        return `
          background: ${theme.colors.primary[900]};
          color: white;
          &:hover {
            background: ${theme.colors.primary[800]};
            box-shadow: 0 4px 12px rgba(255, 84, 20, 0.3);
          }
        `;
      case 'warning':
        return `
          background: ${theme.colors.secondary[2].main};
          color: ${theme.colors.gray[900]};
          &:hover {
            background: ${theme.colors.secondary[5].main};
            box-shadow: 0 4px 12px rgba(255, 160, 77, 0.3);
          }
        `;
      case 'info':
        return `
          background: ${theme.colors.secondary[4].main};
          color: white;
          &:hover {
            background: ${theme.colors.accent[1][900]};
            box-shadow: 0 4px 12px rgba(61, 187, 255, 0.3);
          }
        `;
    }
  }}

  &:active {
    transform: scale(0.98);
  }
`;

export const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.accent[1][600]};
  border: 1px solid ${({ theme }) => theme.colors.accent[1][700]};
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
`;

export const InfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.paragraph.p1.size};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 12px;
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: ${({ theme }) => theme.typography.paragraph.p5.size};
    color: ${({ theme }) => theme.colors.gray[800]};
    line-height: 1.6;
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;

    &:before {
      content: '•';
      position: absolute;
      left: 8px;
      color: ${({ theme }) => theme.colors.primary[900]};
      font-weight: bold;
    }

    strong {
      color: ${({ theme }) => theme.colors.base.black};
      font-weight: 600;
    }
  }
`;

export const BackButton = styled.button`
  display: block;
  margin: 32px auto 0;
  padding: 12px 24px;
  font-size: ${({ theme }) => theme.typography.paragraph.p3.size};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[700]};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:active {
    transform: scale(0.98);
  }
`;
