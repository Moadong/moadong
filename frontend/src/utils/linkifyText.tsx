import React from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const linkifyText = (text: string) => {
  return text.split(URL_REGEX).map((part, index) => {
    if (URL_REGEX.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }

    return (
      <span key={index}>
        {part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </span>
    );
  });
};