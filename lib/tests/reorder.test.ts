import { expect, test } from 'vitest'
import { sameUtcMinus3Day, utcMinus3DayKey } from '../reorder'

test('expected two instants on the same UTC-3 day to be the same day', () => {
  const a = new Date('2026-08-04T03:00:00Z')
  const b = new Date('2026-08-04T20:00:00Z')
  expect(sameUtcMinus3Day(a, b)).toBe(true)
})

test('expected two instants on different UTC-3 days not to be the same day', () => {
  const a = new Date('2026-08-04T03:00:00Z')
  const b = new Date('2026-08-05T03:00:00Z')
  expect(sameUtcMinus3Day(a, b)).toBe(false)
})

test('expected an instant after UTC-3 midnight to belong to the next day', () => {
  // 2026-08-05 02:00 UTC == 2026-08-04 23:00 UTC-3 (still the 4th)
  const before = new Date('2026-08-05T02:00:00Z')
  expect(utcMinus3DayKey(before)).toBe('2026-7-4')

  // 2026-08-05 03:00 UTC == 2026-08-05 00:00 UTC-3 (start of the 5th)
  const after = new Date('2026-08-05T03:00:00Z')
  expect(utcMinus3DayKey(after)).toBe('2026-7-5')
})

test('expected the midnight boundary to split days correctly', () => {
  const day = new Date('2026-08-04T03:00:00Z')
  const nextDay = new Date('2026-08-05T02:59:59Z')
  expect(sameUtcMinus3Day(day, nextDay)).toBe(true)
  const nextDayStart = new Date('2026-08-05T03:00:00Z')
  expect(sameUtcMinus3Day(day, nextDayStart)).toBe(false)
})
