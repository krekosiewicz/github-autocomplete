import React, { useState, useRef } from 'react';
import useDebounce from '../hooks/useDebounce';
import CloseIcon from '../icons/closeIcon';
import { MakersDenClipButton } from './makersDenButton';
import useApiRequest from '../hooks/useApiRequest';
import useUrlSearchParams from '../hooks/useUrlSearchParams';
import { useAtom } from 'jotai';
import { filterValueAtom, queryAtom } from '../store/atoms';

const Autocomplete: React.FC = () => {
  const [query, setQuery] = useAtom(queryAtom);
  const [filterValues, setFilterValues] = useAtom(filterValueAtom);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedQuery = useDebounce(query, 500);
  useUrlSearchParams();

  const { results, loading, error } = useApiRequest(debouncedQuery, filterValues);



  // usecallback -> not sure
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };


  //useCallback
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const totalResults = userResults.length + repositoryResults.length;

    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, totalResults - 1));
      listRef.current?.children[selectedIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      listRef.current?.children[selectedIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      const allResults = [...userResults, ...repositoryResults];
      window.open(allResults[selectedIndex].html_url, '_blank');
    }
  };


  // usecallback
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


  //useMemo
  const userResults = results.filter(result => result.login);
  //useMemo
  const repositoryResults = results.filter(result => result.name);

  return (
    <div className="p-4 bg-makers-den w-[500px]">
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
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search GitHub"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          <div className="absolute top-1/2 transform -translate-y-1/2 right-4 flex items-center">
            {filterValues.map((filter) => (
              <div key={filter} className="flex items-center mr-2 bg-gray-200 px-2 py-1 rounded">
                <span>{filter}</span>
                <button
                  onClick={() => handleDeleteFilter(filter)}
                  className="ml-1 text-red-500"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading && <div className={"bg-white p-4 text-center"}>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && results.length === 0 && query.length >= 3 && <div>No results found</div>}
      <ul ref={listRef} className="mt-4 bg-white max-h-[300px] overflow-auto">
        {userResults.length > 0 && <li className="font-bold p-2">Users</li>}
        {userResults.map((result, index) => (
          <li
            key={result.id}
            className={`cursor-pointer p-2 pl-4 my-2 border-y border-dotted border-gray-300 ${index === selectedIndex ? 'bg-green-400' : ''} hover:bg-green-400`}
            onClick={() => window.open(result.html_url, '_blank')}
          >
            {result.login}
          </li>
        ))}
        {repositoryResults.length > 0 && <li className="font-bold p-2">Repositories</li>}
        {repositoryResults.map((result, index) => (
          <li
            key={result.id}
            className={`cursor-pointer p-2 pl-4 my-2 border-y border-dotted border-gray-300 ${index === selectedIndex - userResults.length ? 'bg-green-400' : ''} hover:bg-green-400`}
            onClick={() => window.open(result.html_url, '_blank')}
          >
            {result.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
