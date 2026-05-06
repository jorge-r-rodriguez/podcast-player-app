import { act, renderHook } from '@testing-library/react'

import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))

    expect(result.current).toBe('initial')
  })

  it('updates the value after the configured delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })

    expect(result.current).toBe('first')

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('second')
  })

  it('clears previous pending updates when value changes quickly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'third' })

    act(() => {
      jest.advanceTimersByTime(299)
    })

    expect(result.current).toBe('first')

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current).toBe('third')
  })
})
