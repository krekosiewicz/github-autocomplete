import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { CircularProgress, List, ListItem, TextField } from '@mui/material';
import { useDebounceFilter } from './hooks/useDebounceFilter.hook';

interface Result {
  id: number;
  login?: string;
  name?: string;
  html_url: string;
}

const Autocomplete: React.FC = () => {
  const [filterValues, dispatch] = useDebounceFilter({ Q: '', filterValue: '' });
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { Q, filterValue } = filterValues;

      // Extract the actual query part
      const query = Q.replace(/#(user|repository):\s*/, '');

      // Check if the query is valid
      const isValidQuery = query.length >= 3;
      const isFilterUser = filterValue === '#user:';
      const isFilterRepository = filterValue === '#repository:';

      if (!isValidQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isFilterUser) {
          const response = await axios.get(`https://api.github.com/search/users?q=${query}&per_page=50`);
          setResults(response.data.items.map((item: any) => ({ id: item.id, login: item.login, html_url: item.html_url })));
        } else if (isFilterRepository) {
          const response = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=50`);
          setResults(response.data.items.map((item: any) => ({ id: item.id, name: item.name, html_url: item.html_url })));
        } else {
          const usersResponse = await axios.get(`https://api.github.com/search/users?q=${query}&per_page=50`);
          const reposResponse = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=50`);

          const combinedResults = [
            ...usersResponse.data.items.map((item: any) => ({ id: item.id, login: item.login, html_url: item.html_url })),
            ...reposResponse.data.items.map((item: any) => ({ id: item.id, name: item.name, html_url: item.html_url }))
          ];

          combinedResults.sort((a, b) => {
            const nameA = a.login || a.name || '';
            const nameB = b.login || b.name || '';
            return nameA.localeCompare(nameB);
          });

          setResults(combinedResults);
        }
      } catch (err) {
        console.log(err);
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filterType = value.startsWith('#user:') ? '#user:' : value.startsWith('#repository:') ? '#repository:' : '';

    dispatch({ type: 'UPDATE_FILTER', field: 'Q', value });
    dispatch({ type: 'UPDATE_FILTER', field: 'filterValue', value: filterType });
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

  return (
    <div>
      <TextField
        label="Search GitHub"
        variant="outlined"
        fullWidth
        value={filterValues.Q}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {loading && <CircularProgress />}
      {error && <div>{error}</div>}
      {!loading && !error && results.length === 0 && filterValues.Q.length >= 3 && <div>No results found</div>}
      <List ref={listRef}>
        {results.map((result, index) => (
          <ListItem
            key={result.id}
            selected={index === selectedIndex}
            onClick={() => window.open(result.html_url, '_blank')}
          >
            {result.login || result.name}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Autocomplete;
