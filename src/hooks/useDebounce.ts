import { useEffect, useState } from 'react';
import usePrevious from './usePrevious'; // Adjust the path as necessary

const useDebounce = (value: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (value !== prevValue) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [value, delay, prevValue]);

  return debouncedValue;
};

export default useDebounce;
