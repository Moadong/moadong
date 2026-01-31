import { ReactNode } from 'react';
import { colors } from '@/styles/theme/colors';

const URL_MATCH_REGEX = /https?:\/\/[a-zA-Z0-9./?=#_%\-]+/g;
const URL_TRAILING_CHARS_REGEX = /[.,!?)"'`;: 가-힣]+$/;

const cleanUrl = (url: string)=>
  url.replace(URL_TRAILING_CHARS_REGEX, '');

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

  for (const urlMatch of text.matchAll(URL_MATCH_REGEX)) {
    const urlStartIndex = urlMatch.index!;
    const matchedUrlText = urlMatch[0];
    const trimmedUrlText = cleanUrl(matchedUrlText);

    if (urlStartIndex > cursor) {
      const plainTextChunk = text.slice(cursor, urlStartIndex);
      nodes.push(
        ...renderTextWithLineBreaks(plainTextChunk, `text-${cursor}`)
      );
    }
    
    nodes.push(
      <a 
        key={urlStartIndex} 
        href={trimmedUrlText} 
        style={{ 
          color: colors.accent[1][900], 
          textDecoration: 'underline' 
          }}
        >
        {trimmedUrlText}
      </a>
    );

    cursor = urlStartIndex + matchedUrlText.length;
  }

  if (cursor < text.length) {
    const remainingTextChunk = text.slice(cursor);
    nodes.push(
      ...renderTextWithLineBreaks(remainingTextChunk, `text-${cursor}`)
    );
  }

  return <span style={{ display: 'inline' }}>{nodes}</span>;
};