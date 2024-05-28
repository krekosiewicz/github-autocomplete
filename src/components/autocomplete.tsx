import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { CircularProgress, List, ListItem, TextField, Chip, InputAdornment } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { queryAtom, filterValueAtom } from '../store/atoms';
import useDebounce from '../hooks/useDebounce';
import CloseIcon from '../icons/CloseIcon';
import { MakersDenClipButton } from './makersDenButton'

interface Result {
  id: number;
  login?: string;
  name?: string;
  html_url: string;
}

const Autocomplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useAtom(queryAtom);
  const [filterValues, setFilterValues] = useAtom(filterValueAtom);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const initialLoadRef = useRef(true);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (initialLoadRef.current) {
      const params = new URLSearchParams(location.search);
      const queryParam = params.get('q') || '';
      const filterParam = params.get('filterValue')?.split(',') || [];

      if (queryParam) {
        setQuery(queryParam);
      }

      if (filterParam.length) {
        setFilterValues(filterParam);
      }

      initialLoadRef.current = false;
    }
  }, [location.search, setQuery, setFilterValues]);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const requests = [];
        if (filterValues.includes('#user')) {
          requests.push(axios.get(`https://api.github.com/search/users?q=${debouncedQuery}&per_page=50`));
        }
        if (filterValues.includes('#repository')) {
          requests.push(axios.get(`https://api.github.com/search/repositories?q=${debouncedQuery}&per_page=50`));
        }
        if (!filterValues.length) {
          requests.push(axios.get(`https://api.github.com/search/users?q=${debouncedQuery}&per_page=50`));
          requests.push(axios.get(`https://api.github.com/search/repositories?q=${debouncedQuery}&per_page=50`));
        }

        const responses = await Promise.all(requests);

        const combinedResults = responses.flatMap(response => {
          return response.data.items.map((item: any) => ({
            id: item.id,
            login: item.login,
            name: item.name,
            html_url: item.html_url,
          }));
        });

        combinedResults.sort((a, b) => {
          const nameA = a.login || a.name || '';
          const nameB = b.login || b.name || '';
          return nameA.localeCompare(nameB);
        });

        setResults(combinedResults);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery, filterValues]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (filterValues.length) {
      params.set('filterValue', filterValues.join(','));
    } else {
      params.delete('filterValue');
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [query, filterValues, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, results.length - 1));
      listRef.current?.children[selectedIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      listRef.current?.children[selectedIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      window.open(results[selectedIndex].html_url, '_blank');
    }
  };

  const handleClipClick = (clip: string) => {
    setFilterValues(prevFilters =>
      prevFilters.includes(clip)
        ? prevFilters.filter(f => f !== clip)
        : [...prevFilters, clip]
    );
  };

  const handleDeleteFilter = (filter: string) => {
    setFilterValues(prevFilters => prevFilters.filter(f => f !== filter));
  };

  return (
    <div className="p-4 bg-makers-den  w-[500px]">
      <div className="mb-4 flex gap-2">
        <MakersDenClipButton
          id="#user"
          label="#users"
          handleClick={handleClipClick}
          isDisabled={filterValues.includes('#user')}
        />
        <MakersDenClipButton
          id="#repository"
          label="#repositories"
          handleClick={handleClipClick}
          isDisabled={filterValues.includes('#repository')}
        />
      </div>
      <TextField
        label="Search GitHub"
        variant="outlined"
        fullWidth
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {filterValues.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onDelete={() => handleDeleteFilter(filter)}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </InputAdornment>
          ),
        }}
        className="mb-4"
      />
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && results.length === 0 && query.length >= 3 && <div>No results found</div>}
      <List ref={listRef} className="mt-4">
        {results.map((result, index) => (
          <ListItem
            key={result.id}
            selected={index === selectedIndex}
            onClick={() => window.open(result.html_url, '_blank')}
            className="cursor-pointer"
          >
            {result.login || result.name}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Autocomplete;
