"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/queries";
import { operationTable, categoryTable, paymentMethodTable } from "@/db/schema";
import { OperationSchema } from "./definitions";

export type CsvImportRow = {
  nome: string;
  valor: string;
  data: string;
  categoria?: string;
  metodo_pagamento?: string;
  parcelas?: string;
  pago?: string;
  descricao?: string;
  fixo?: string;
  mes_inicio?: string;
  mes_fim?: string;
  payment_method_id_override?: number;
};

export type CsvImportResult = {
  success: boolean;
  imported: number;
  total: number;
  errors: { row: number; message: string }[];
};

function parseDateBR(dateStr: string): Date | null {
  if (!dateStr) return null;

  const trimmed = dateStr.trim();

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`);
  }

  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (brMatch) {
    return new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`);
  }

  return null;
}

function parseValueBR(valueStr: string): number | null {
  if (!valueStr) return null;

  const cleaned = valueStr
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const num = Math.abs(parseFloat(cleaned));
  if (isNaN(num)) return null;

  return Math.round(num * 100);
}

function parseBoolean(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  return v === "sim" || v === "true" || v === "1" || v === "yes";
}

function parseInstallments(value: string | undefined | null): number {
  if (!value) return 1;
  const n = parseInt(value.trim(), 10);
  if (isNaN(n) || n < 1) return 1;
  if (n > 12) return 12;
  return n;
}

export async function importOperationsFromCsvAction(
  rows: CsvImportRow[],
  isIncome: boolean
): Promise<CsvImportResult> {
  const errors: { row: number; message: string }[] = [];
  let imported = 0;

  const allCategories = await db.select().from(categoryTable);
  const allPaymentMethods = await db.select().from(paymentMethodTable);

  const categoryMap = new Map<string, number>();
  for (const cat of allCategories) {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
  }

  const paymentMethodMap = new Map<string, number>();
  for (const pm of allPaymentMethods) {
    paymentMethodMap.set(pm.name.toLowerCase(), pm.id);
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    const valueCents = parseValueBR(row.valor);
    if (valueCents === null) {
      errors.push({ row: rowNum, message: `Valor inválido: "${row.valor}"` });
      continue;
    }

    const date = parseDateBR(row.data);
    if (!date) {
      errors.push({ row: rowNum, message: `Data inválida: "${row.data}"` });
      continue;
    }

    const parcelas = parseInstallments(row.parcelas);
    const isPaid = parseBoolean(row.pago);
    const isFixo = row.fixo?.trim().toLowerCase() === "sim" || row.fixo?.trim().toLowerCase() === "true" || row.fixo?.trim().toLowerCase() === "1" || row.fixo?.trim().toLowerCase() === "yes";
    const periodId = isFixo ? 3 : null;
    const startDate = isFixo ? (row.mes_inicio ? parseDateBR(row.mes_inicio) : date) : null;
    const endDate = isFixo && row.mes_fim ? parseDateBR(row.mes_fim) : null;

    let categoryId: number | null = null;
    if (row.categoria?.trim()) {
      const matched = categoryMap.get(row.categoria.trim().toLowerCase());
      if (matched !== undefined) {
        categoryId = matched;
      } else {
        errors.push({ row: rowNum, message: `Categoria não encontrada: "${row.categoria}"` });
        continue;
      }
    }

    let paymentMethodId: number | null = null;
    if (row.payment_method_id_override !== undefined) {
      paymentMethodId = row.payment_method_id_override;
    } else if (row.metodo_pagamento?.trim()) {
      const matched = paymentMethodMap.get(row.metodo_pagamento.trim().toLowerCase());
      if (matched !== undefined) {
        paymentMethodId = matched;
      } else {
        errors.push({ row: rowNum, message: `Método de pagamento não encontrado: "${row.metodo_pagamento}"` });
        continue;
      }
    }

    const validationResult = OperationSchema.safeParse({
      name: row.nome,
      description: row.descricao || null,
      date,
      value: valueCents,
      parcelas,
      is_paid: isPaid,
      is_income: isIncome,
      category_id: categoryId,
      payment_method_id: paymentMethodId,
      period_id: periodId,
      start_date: startDate,
      end_date: endDate,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.entries(fieldErrors)
        .map(([field, msgs]) => `${field}: ${msgs?.join(", ")}`)
        .join("; ");
      errors.push({ row: rowNum, message: `Erro de validação: ${firstError}` });
      continue;
    }

    try {
      await db.insert(operationTable).values(validationResult.data);
      imported++;
    } catch (err) {
      errors.push({ row: rowNum, message: `Erro ao inserir no banco: ${err instanceof Error ? err.message : "Erro desconhecido"}` });
    }
  }

  if (imported > 0) {
    revalidatePath("/dashboard");
    revalidatePath("/saidas");
    revalidatePath("/saidas/limites");
    revalidatePath("/entradas");
  }

  return {
    success: imported > 0 || errors.length === 0,
    imported,
    total: rows.length,
    errors,
  };
}
