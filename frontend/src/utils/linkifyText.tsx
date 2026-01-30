import { ReactNode } from 'react';
import { colors } from '@/styles/theme/colors';

const URL_REGEX = /https?:\/\/[^\s]+/g;

const renderTextWithLineBreaks = (
  text: string, 
  keyPrefix: string
): ReactNode[] => {
  const lines = text.split('\n');

  return lines.flatMap((lineText, lineIndex) => {
    const nodes: ReactNode[] = [lineText];

    if (lineIndex < lines.length - 1) {
      nodes.push(<br key={`${keyPrefix}-br-${lineIndex}`} />);
    }
    return nodes;
  });
};

export const linkifyText = (text: string) => {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const urlMatch of text.matchAll(URL_REGEX)) {
    const urlStartIndex = urlMatch.index!;
    const urlText = urlMatch[0];

    if (urlStartIndex > cursor) {
      const plainTextChunk = text.slice(cursor, urlStartIndex);
      nodes.push(
        ...renderTextWithLineBreaks(plainTextChunk, `text-${cursor}`)
      );
    }
    
    nodes.push(
      <a 
        key={urlStartIndex} 
        href={urlText} 
        style={{ 
          color: colors.accent[1][900], 
          textDecoration: 'underline' 
          }}
        >
        {urlText}
      </a>
    );

    cursor = urlStartIndex + urlText.length;
  }

  if (cursor < text.length) {
    const remainingTextChunk = text.slice(cursor);
    nodes.push(
      ...renderTextWithLineBreaks(remainingTextChunk, `text-${cursor}`)
    );
  }

  return <span style={{ display: 'inline' }}>{nodes}</span>;
};