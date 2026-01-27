import React from 'react';
import { colors } from '@/styles/theme/colors';

const URL_REGEX = /https?:\/\/[^\s]+/g;

const renderTextWithLineBreaks = (
  text: string, 
  keyPrefix: string
): React.ReactNode[] => {
  return text.split('\n').flatMap((line, index, arr) => {
    const nodes: React.ReactNode[] = [line];

    if (index < arr.length - 1) {
      nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
    }
    return nodes;
  });
};

export const linkifyText = (text: string) => {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let urlMatch: RegExpExecArray | null;

  while ((urlMatch = URL_REGEX.exec(text)) !== null) {
    const urlStartIndex = urlMatch.index;
    const urlText = urlMatch[0];

    if (urlStartIndex > cursor) {
      const plainTextChunk = text.slice(cursor, urlStartIndex);
      nodes.push(
        ...renderTextWithLineBreaks(plainTextChunk, `text-${cursor}`)
      );
    }
    
    nodes.push(
      <a 
        key={urlMatch.index} 
        href={urlMatch[0]} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          color: `${colors.accent[1][900]}`, 
          textDecoration: 'underline' 
          }}
        >
        {urlText}
      </a>
    );

    cursor = URL_REGEX.lastIndex;
  }

  if (cursor < text.length) {
    const remainingText = text.slice(cursor);
    nodes.push(
      ...renderTextWithLineBreaks(remainingText, `text-${cursor}`)
    );
  }

  return <span style={{ display: 'inline' }}>{nodes}</span>;
};