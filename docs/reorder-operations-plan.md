# Plan: Reorder operations via move up/down buttons

## Decisions
- Add two buttons in the **Ações** column of the variable-operations tables (`components/data-table/ReducedOperationDataTable.tsx`, used on `/saidas` and `/entradas`).
- "Neighbor" = row directly above/below **as displayed** (respects current sort/filter), computed client-side from the row model and passed to the server.
- Reorder via a new **`sort_order`** column (dates and ids untouched). Move = swap `sort_order` with the neighbor.
- Same-day rule enforced **server-side** (authoritative block) + button disabled client-side when neighbor is a different day.
- Sort queries by `(date DESC, sort_order ASC)`; existing `.reverse()` pipeline renders within-day order as `sort_order DESC`, preserving current behavior after backfill.

## 1. Migration
- `db/schema.ts`: add `sort_order: integer().notNull().default(0)` to `operationTable`.
- `npm run generate`; inspect/augment the migration:
  - `ALTER TABLE operation ADD COLUMN sort_order integer NOT NULL DEFAULT 0`
  - Backfill `UPDATE operation SET sort_order = id;` (handwritten data migration, precedent: `0091`).
  - Ensure `vw_operation_with_category`, `vw_expense_with_category`, `vw_income_with_category` (+ dependents like `vw_expense_balance`) are dropped/recreated so they expose `sort_order`; verify drop/create ordering.
- **Extra data migration `0093` (found during implementation):** 185 legacy operations kept real intra-day times (11:58, 14:31, ...) that escaped the `0091` normalization, so the full-timestamp sort overrode `sort_order` within a day and moves had no visible effect. Added `0093_normalize_operation_dates.sql` to snap every operation `date` to `03:00 UTC` of its UTC-3 day (day preserved), making `sort_order` the single within-day key.
- Note: `drizzle-kit migrate` (CLI) hung on the remote DB; applied 0093 via `drizzle-orm/libsql/migrator`'s `migrate()` in a throwaway script. The migration file must not end with a trailing `--> statement-breakpoint` (causes "SQL string does not contain any statement").
- Apply with `npm run migrate` (or the programmatic migrator).

## 2. Queries (`db/queries/`)
- `expense.ts` `getExpenses`, `incomes.ts` `getIncomes`, `operation.ts` `getOperations`: `orderBy(desc(date), asc(sort_order))`.

## 3. Insert assigns sort_order (`db/queries/operation.ts`)
- `insertOperation`: `RETURNING id`, then set `sort_order = id` (transaction). Covers new ops + `duplicateOperationAction`.

## 4. Types
- `lib/definitions.ts`: add `sort_order?: number` to `Operation`.

## 5. Pure helper + tests
- New `lib/reorder.ts`: `sameUtcMinus3Day(a, b)` using `convertUtcToLocal`.
- New `lib/tests/reorder.test.ts`: same-day true/false incl. UTC-3 midnight boundary.

## 6. Server action (`actions/operation-actions.ts`)
- New `moveOperationAction(prevState, formData)` reading `id` + `neighborId`.
- Load both via `getOperationById`; error if missing or `id === neighborId`.
- Verify same UTC-3 day -> block with `"Só é possível reordenar transações do mesmo dia"`.
- Swap `sort_order` inside `db.transaction(...)`.
- `revalidatePath("/saidas")`, `/entradas`, `/dashboard`; return `OperationActionState`.

## 7. UI
- New `components/dialogs/MoveOperationButton.tsx` (mirrors `DuplicateOperationButton`): `ArrowUp`/`ArrowDown` icon button, hidden `id` + `neighborId`, `useActionState` + toast + `router.refresh`, `disabled` prop.
- `ReducedOperationDataTable.tsx`: in Ações cell access `table`, compute `prev`/`next` from `table.getRowModel().rows`; render both buttons, disabled when at list edge, current/neighbor `parcelas > 1`, or neighbor on a different day.

## 8. Verification
- `npm run lint`, `npm run test`, `npm run build`.

## Edge cases / notes
- Parcelado rows: buttons disabled (expanded date != stored date would break the same-day check).
- Fixed-expenses and dashboard tables untouched (per scope choice).
- `sort_order` is only a within-day tiebreaker; never changes displayed day/month/year.
