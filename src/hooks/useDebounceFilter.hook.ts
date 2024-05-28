import { useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePrevious from './usePrevious.hook'; // Adjust this path as needed

export type FilterValues = {
  Q: string;
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

export const useDebounceFilter = (initialFilterValues: FilterValues, debounceDelay = 2000) => {
  const [filterValues, dispatch] = useReducer(filterReducer, initialFilterValues);
  const prevFilterValues = usePrevious(filterValues);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasChanged = filterValues && prevFilterValues &&
      (Object.keys(filterValues) as Array<keyof FilterValues>).some((key) => filterValues[key] !== prevFilterValues[key]);

    if (hasChanged) {
      const timeoutId = setTimeout(() => {
        const params = new URLSearchParams(location.search);
        params.set('q', filterValues.Q);
        if (filterValues.filterValue) {
          params.set('filterValue', filterValues.filterValue);
        } else {
          params.delete('filterValue');
        }
        navigate({ search: params.toString() }, { replace: true });
      }, debounceDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [filterValues, prevFilterValues, debounceDelay, navigate, location.search]);

  return [filterValues, dispatch] as const;
}
