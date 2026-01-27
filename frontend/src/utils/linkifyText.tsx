import { colors } from '@/styles/theme/colors';
import React from 'react';

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const linkifyText = (text: string) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const s = text.slice(lastIndex, match.index);
      parts.push(...s.split('\n').flatMap((line, i, arr) => (i < arr.length - 1 ? [line, <br key={`${lastIndex}-${i}`} />] : [line])));
    }
    parts.push(
      <a 
        key={match.index} 
        href={match[0]} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          color: `${colors.accent[1][900]}`, 
          textDecoration: 'underline' 
          }}
        >
        {match[0]}
      </a>
    );
    lastIndex = URL_REGEX.lastIndex;
  }
  if (lastIndex < text.length) {
    const s = text.slice(lastIndex);
    parts.push(...s.split('\n').flatMap((line, i, arr) => (i < arr.length - 1 ? [line, <br key={`${lastIndex}-${i}`} />] : [line])));
  }

  return <span style={{ display: 'inline' }}>{parts}</span>;
};