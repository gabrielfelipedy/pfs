import { Operation } from "./definitions";

export function monthToNumber(date: Date): number {
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

export function monthStrToNumber(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return y * 12 + (m - 1);
}

// Valor de uma única parcela (em centavos). Para operações não parceladas
// (parcelas === 1) devolve o valor total.
export function parcelaValue(operation: Operation): number {
  return Math.round((operation.value ?? 0) / (operation.parcelas || 1));
}

// Valor efetivo a ser usado em agregações (somas, gráficos, cards). Operações
// já expandidas carregam `parcela_value`; operações brutas são divididas aqui.
export function operationValue(operation: Operation): number {
  return operation.parcela_value ?? parcelaValue(operation);
}

export interface ExpandedParcela extends Operation {
  parcela_value: number;
  parcela_atual: number;
  parcela_total: number;
}

// Expande operações parceladas (parcelas > 1) para um mês alvo, retornando
// uma cópia por mês coberto com os campos de exibição. O valor total
// armazenado é preservado em `value`; o valor da parcela fica em
// `parcela_value`.
export function expandParcelamentosForMonth(
  operations: Operation[],
  month: string,
): ExpandedParcela[] {
  const [targetYear, targetMonth] = month.split("-").map(Number);
  const targetMonthIndex = targetYear * 12 + (targetMonth - 1);

  return operations
    .filter((o) => (o.parcelas ?? 1) > 1 && o.date)
    .filter((o) => {
      const numParcelas = o.parcelas ?? 1;
      const startMonthIndex = monthToNumber(new Date(o.date));
      const endMonthIndex = startMonthIndex + (numParcelas - 1);

      return targetMonthIndex >= startMonthIndex && targetMonthIndex <= endMonthIndex;
    })
    .map((o) => {
      const originalDate = new Date(o.date);
      const startMonthIndex = monthToNumber(originalDate);
      const day = Math.min(originalDate.getUTCDate(), 28);

      return {
        ...o,
        parcela_value: parcelaValue(o),
        parcela_atual: targetMonthIndex - startMonthIndex + 1,
        parcela_total: o.parcelas ?? 1,
        date: new Date(
          Date.UTC(targetYear, targetMonth - 1, day) + 3 * 60 * 60 * 1000,
        ),
      };
    });
}
