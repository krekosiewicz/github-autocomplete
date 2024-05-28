import { renderHook, act } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import useUrlSearchParams from './useUrlSearchParams'; // Adjust the path as necessary
import { queryAtom, filterValueAtom } from '../store/atoms';

import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

test('dummy test', () => {
  // TODO mockup axios
  // render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
  expect(true).toBe(true);
});


//
// // Mock the necessary hooks
// jest.mock('react-router-dom', () => ({
//   useLocation: jest.fn(),
//   useNavigate: jest.fn(),
// }));
//
// jest.mock('jotai', () => ({
//   useAtom: jest.fn(),
// }));
//
// describe('useUrlSearchParams', () => {
//   const setQueryMock = jest.fn();
//   const setFilterValuesMock = jest.fn();
//   const navigateMock = jest.fn();
//   const initialLocation = {
//     search: '?q=test&filterValue=val1,val2'
//   };
//
//   beforeEach(() => {
//     (useLocation as jest.Mock).mockReturnValue(initialLocation);
//     (useNavigate as jest.Mock).mockReturnValue(navigateMock);
//     (useAtom as jest.Mock).mockImplementation((atom) => {
//       if (atom === queryAtom) {
//         return ['test', setQueryMock];
//       } else if (atom === filterValueAtom) {
//         return [['val1', 'val2'], setFilterValuesMock];
//       }
//       return [];
//     });
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   it('should set query and filter values from URL on initial load', () => {
//     renderHook(() => useUrlSearchParams());
//
//     expect(setQueryMock).toHaveBeenCalledWith('test');
//     expect(setFilterValuesMock).toHaveBeenCalledWith(['val1', 'val2']);
//   });
//
//   it('should update URL search params when query or filterValues change', () => {
//     const { rerender } = renderHook(() => useUrlSearchParams());
//
//     act(() => {
//       rerender();
//     });
//
//     expect(navigateMock).toHaveBeenCalledWith({ search: 'q=test&filterValue=val1,val2' }, { replace: true });
//
//     // Simulate changing query and filterValues
//     (useAtom as jest.Mock).mockImplementation((atom) => {
//       if (atom === queryAtom) {
//         return ['newTest', setQueryMock];
//       } else if (atom === filterValueAtom) {
//         return [['newVal1', 'newVal2'], setFilterValuesMock];
//       }
//       return [];
//     });
//
//     act(() => {
//       rerender();
//     });
//
//     expect(navigateMock).toHaveBeenCalledWith({ search: 'q=newTest&filterValue=newVal1,newVal2' }, { replace: true });
//   });
//
//   it('should remove filterValue from URL if filterValues is empty', () => {
//     (useAtom as jest.Mock).mockImplementation((atom) => {
//       if (atom === queryAtom) {
//         return ['test', setQueryMock];
//       } else if (atom === filterValueAtom) {
//         return [[], setFilterValuesMock];
//       }
//       return [];
//     });
//
//     const { rerender } = renderHook(() => useUrlSearchParams());
//
//     act(() => {
//       rerender();
//     });
//
//     expect(navigateMock).toHaveBeenCalledWith({ search: 'q=test' }, { replace: true });
//   });
// });