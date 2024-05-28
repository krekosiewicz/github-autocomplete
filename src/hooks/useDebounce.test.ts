import { act, renderHook } from '@testing-library/react';
import useDebounce from './useDebounce'; // Adjust the path as necessary

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial'));
    expect(result.current).toBe('initial');
  });

  it('should return the debounced value after the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 }
    });

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'changed', delay: 500 });
    });

    expect(result.current).toBe('initial'); // Value should not change immediately

    act(() => {
      jest.advanceTimersByTime(500); // Fast forward time
    });

    expect(result.current).toBe('changed'); // Value should be updated after the delay
  });

  it('should reset the delay timer if value changes before the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 }
    });

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'changed', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(250); // Advance half the time
    });

    act(() => {
      rerender({ value: 'changed again', delay: 500 });
    });

    expect(result.current).toBe('initial'); // Value should not change immediately

    act(() => {
      jest.advanceTimersByTime(500); // Fast forward time
    });

    expect(result.current).toBe('changed again'); // Value should be updated after the delay
  });

  it('should handle rapid successive updates correctly', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 }
    });

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'update1', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(100); // Fast forward time a little
    });

    act(() => {
      rerender({ value: 'update2', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(100); // Fast forward time a little
    });

    act(() => {
      rerender({ value: 'update3', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(300); // Advance time to trigger debounce
    });

    act(() => {
      jest.advanceTimersByTime(200); // Ensure the debounce period has fully passed
    });

    expect(result.current).toBe('update3'); // Value should be updated to the last value
  });
});