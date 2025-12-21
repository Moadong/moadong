import { ReactNode } from 'react';
import * as Styled from './ContentSection.styles';

interface ContentSectionProps {
  children: ReactNode;
}

interface ContentSectionHeaderProps {
  title: string;
  action?: ReactNode;
}

interface ContentSectionBodyProps {
  children: ReactNode;
}

const ContentSectionRoot = ({ children }: ContentSectionProps) => {
  return <Styled.ContentSection>{children}</Styled.ContentSection>;
};

const ContentSectionHeader = ({
  title,
  action,
}: ContentSectionHeaderProps) => {
  return (
    <Styled.ContentSectionHeader>
      <Styled.ContentSectionTitle>{title}</Styled.ContentSectionTitle>
      {action && <div>{action}</div>}
    </Styled.ContentSectionHeader>
  );
};

const ContentSectionBody = ({ children }: ContentSectionBodyProps) => {
  return <Styled.ContentSectionBody>{children}</Styled.ContentSectionBody>;
};

export const ContentSection = Object.assign(ContentSectionRoot, {
  Header: ContentSectionHeader,
  Body: ContentSectionBody,
});
