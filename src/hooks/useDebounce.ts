import { useEffect, useState } from 'react';
import usePrevious from './usePrevious.hook'; // Adjust this path as needed

const useDebounce = (value: string, delay: number = 2000) => {
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



// alternatively
// import { useEffect, useState } from 'react';
// import usePrevious from './usePrevious.hook'; // Adjust this path as needed
// import isEqual from 'lodash/isEqual'; // Import deep comparison function from lodash
//
// const useDebounce = <T>(value: T, delay: number = 2000) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   const prevValue = usePrevious(value);
//
//   useEffect(() => {
//     if (!isEqual(value, prevValue)) {
//       const handler = setTimeout(() => {
//         setDebouncedValue(value);
//       }, delay);
//
//       return () => {
//         clearTimeout(handler);
//       };
//     }
//   }, [value, delay, prevValue]);
//
//   return debouncedValue;
// };
//
// export default useDebounce;