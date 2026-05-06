import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it('formats minute durations', () => {
    expect(formatDuration(15 * 60000)).toBe('15 min')
  })

  it('formats hour durations', () => {
    expect(formatDuration(75 * 60000)).toBe('1h 15m')
  })

  it('handles missing values', () => {
    expect(formatDuration(null)).toBe('Unknown duration')
  })
})
