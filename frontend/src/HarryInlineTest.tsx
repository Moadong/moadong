import { useEffect, useMemo, useState } from 'react';

interface HarryInlineTestProps {
  firstName: string;
  lastName: string;
}

const HarryInlineTest = ({ firstName, lastName }: HarryInlineTestProps) => {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  const upperName = useMemo(() => fullName.toUpperCase(), [fullName]);

  return <div>{upperName}</div>;
};

export default HarryInlineTest;
