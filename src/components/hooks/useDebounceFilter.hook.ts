import { useEffect, useReducer } from 'react';
import usePrevious from './usePrevious.hook'; // Adjust this path as needed

export type FilterValues = {
  Q: string;
  urlState?: string;
  filterValue?: '#user:' | '#repository:' | '';
}

export type DispatchType = (action: { type: string; field: string; value: any }) => void;

function filterReducer(state: FilterValues, action: { type: string; field: string; value: any }): FilterValues {
  switch (action.type) {
    case 'UPDATE_FILTER':
      return { ...state, [action.field]: action.value };
    default:
      throw new Error('Unhandled action type');
  }
}

export const useDebounceFilter = (initialFilterValues: FilterValues, debounceDelay = 300) => {
  const [filterValues, dispatch] = useReducer(filterReducer, initialFilterValues);
  const prevFilterValues = usePrevious(filterValues);

  useEffect(() => {
    const hasChanged = filterValues && prevFilterValues &&
      (Object.keys(filterValues) as Array<keyof FilterValues>).some((key) => filterValues[key] !== prevFilterValues[key]);

    if (hasChanged) {
      const timeoutId = setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('q', filterValues.Q);
        if (filterValues.filterValue) {
          url.searchParams.set('filter', filterValues.filterValue);
        } else {
          url.searchParams.delete('filter');
        }
        window.history.pushState({}, '', url.toString());
      }, debounceDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [filterValues, prevFilterValues, debounceDelay]);

  return [filterValues, dispatch] as const;
}
