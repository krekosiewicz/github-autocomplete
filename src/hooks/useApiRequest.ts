import { useState, useEffect } from 'react';
import axios from 'axios';

interface Result {
  id: number;
  login?: string;
  name?: string;
  html_url: string;
}

const useApiRequest = (debouncedQuery: string, filterValues: string[]) => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([]);
      return;
    }

    const source = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const requests = [];
        if (filterValues.includes('#user')) {
          requests.push(
            axios.get(`https://api.github.com/search/users?q=${debouncedQuery}&per_page=50`, {
              cancelToken: source.token,
            })
          );
        }
        if (filterValues.includes('#repository')) {
          requests.push(
            axios.get(`https://api.github.com/search/repositories?q=${debouncedQuery}&per_page=50`, {
              cancelToken: source.token,
            })
          );
        }
        if (!filterValues.length) {
          requests.push(
            axios.get(`https://api.github.com/search/users?q=${debouncedQuery}&per_page=50`, {
              cancelToken: source.token,
            })
          );
          requests.push(
            axios.get(`https://api.github.com/search/repositories?q=${debouncedQuery}&per_page=50`, {
              cancelToken: source.token,
            })
          );
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
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.log(err);
          setError('Failed to fetch results');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [debouncedQuery, filterValues]);

  return { results, loading, error };
};

export default useApiRequest;
