import { Fragment } from 'react';

export const parseDescriptionWithLinks = (text: string): React.ReactNode => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
        const isUrl = /^https?:\/\/[^\s]+$/.test(part);
        return isUrl ? (
            <a
                key={`${part}-${index}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0077cc', textDecoration: 'underline' }}
            >
                {part}
            </a>
        ) : (
            <Fragment key={`${part}-${index}`}>{part}</Fragment>
        );
    });
};
