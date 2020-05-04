import { useEffect, useState } from 'react';

export const useDebounce = (initValue: string, delay: number): string => {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
      const timeout = setTimeout(() => {
          setValue(initValue);
      }, delay);

      return () => clearTimeout(timeout);
  }, [initValue, delay]);

  return value;
};