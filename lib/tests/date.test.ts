import { expect, test } from 'vitest'
import {
  convertLocalToUtc,
  convertUtcToLocal,
  formatDateBR,
  formatDateBRMonthYear,
  formatMonthYear,
  toUtcMinus3Date,
  toUtcMinus3Instant,
} from '../date'

test('expected to format yyyy-mm correctly to human readble format', () => {
    expect(formatMonthYear('2026-1')).toBe('Janeiro de 2026')
})

test('expected convertLocalToUtc to store local day as 03:00Z', () => {
    const local = new Date(2026, 7, 4)
    const stored = convertLocalToUtc(local)
    expect(stored.toISOString()).toBe('2026-08-04T03:00:00.000Z')
})

test('expected convertLocalToUtc to keep the UTC-3 day for a midnight date', () => {
    const local = new Date(2026, 7, 4)
    const stored = convertLocalToUtc(local)
    expect(stored.getUTCDate()).toBe(4)
})

test('expected toUtcMinus3Instant to snap any instant to 03:00Z of its UTC day', () => {
    const instant = new Date('2026-08-04T10:30:00Z')
    const snapped = toUtcMinus3Instant(instant)
    expect(snapped.toISOString()).toBe('2026-08-04T03:00:00.000Z')
})

test('expected toUtcMinus3Date to expose the UTC-3 calendar day regardless of browser TZ', () => {
    const stored = new Date('2026-08-04T03:00:00Z')
    const day = toUtcMinus3Date(stored)
    expect(day.getFullYear()).toBe(2026)
    expect(day.getMonth()).toBe(7)
    expect(day.getDate()).toBe(4)
})

test('expected convertUtcToLocal to shift stored instant back to UTC-3 reference', () => {
    const stored = new Date('2026-08-04T03:00:00Z')
    const local = convertUtcToLocal(stored)
    expect(local.getUTCFullYear()).toBe(2026)
    expect(local.getUTCMonth()).toBe(7)
    expect(local.getUTCDate()).toBe(4)
    expect(local.getUTCHours()).toBe(0)
})

test('expected formatDateBR to display the UTC-3 day for a stored 03:00Z instant', () => {
    expect(formatDateBR(new Date('2026-08-04T03:00:00Z'))).toBe('04/08/2026')
})

test('expected formatDateBR to show the previous UTC-3 day for an instant before 03:00Z', () => {
    expect(formatDateBR(new Date('2026-08-04T02:59:59Z'))).toBe('03/08/2026')
})

test('expected toUtcMinus3Date to roll an instant before 03:00Z back one UTC-3 day', () => {
    const day = toUtcMinus3Date(new Date('2026-08-04T02:59:59Z'))
    expect(day.getFullYear()).toBe(2026)
    expect(day.getMonth()).toBe(7)
    expect(day.getDate()).toBe(3)
})

test('expected formatDateBRMonthYear to format the UTC-3 reference', () => {
    expect(formatDateBRMonthYear(new Date('2026-08-04T03:00:00Z'))).toBe('08/26')
})
