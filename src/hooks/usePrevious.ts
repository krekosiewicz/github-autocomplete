import { useEffect, useRef } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  const prevRef = useRef<T>();

  useEffect(() => {
    prevRef.current = ref.current;
    ref.current = value;
  }, [value]);

  return prevRef.current;
}

export default usePrevious;
