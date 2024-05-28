import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { queryAtom, filterValueAtom } from '../store/atoms';

const useUrlSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useAtom(queryAtom);
  const [filterValues, setFilterValues] = useAtom(filterValueAtom);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (initialLoadRef.current) {
      const params = new URLSearchParams(location.search);
      const queryParam = params.get('q') || '';
      const filterParam = params.get('filterValue') || '';
      const filterArray = filterParam.split(',');

      if (queryParam) {
        setQuery(queryParam);
      }

      if (filterArray.length && filterArray[0] !== '') {
        setFilterValues(filterArray);
      }

      initialLoadRef.current = false;
    }
  }, [location.search, setQuery, setFilterValues]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (filterValues.length) {
      // Join filter values without encoding
      params.set('filterValue', filterValues.join(','));
    } else {
      params.delete('filterValue');
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [query, filterValues, navigate]);
};

export default useUrlSearchParams;
