import { expect, test} from 'vitest'
import { formatMonthYear } from '../date'

test('expected to format yyyy-mm correctly to human readble format', () => {
    expect(formatMonthYear('2026-1')).toBe('Janeiro de 2026')
})