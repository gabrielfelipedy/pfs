"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  importOperationsFromCsvAction,
  type CsvImportRow,
  type CsvImportResult,
} from "@/actions/import-actions";

interface Props {
  isIncome: boolean;
  children?: React.ReactNode;
}

const PAGE_SIZE = 5;

export default function ImportCsvDialog({ isIncome, children }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<CsvImportRow[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error(`Erro ao ler CSV: ${results.errors[0].message}`);
          return;
        }
        if (results.data.length === 0) {
          toast.error("Nenhum dado encontrado no CSV");
          return;
        }
        if (results.data.length > 500) {
          toast.error("O arquivo excede o limite de 500 linhas");
          return;
        }

        const isNubank = "title" in (results.data[0] ?? {});

        const mappedRows: CsvImportRow[] = results.data.map((row) => {
          if (isNubank) {
            return {
              nome: row.title || "",
              valor: row.amount || "",
              data: row.date || "",
              parcelas: "1",
              pago: "true",
              payment_method_id_override: 3,
            };
          }
          return {
            nome: row.nome || "",
            valor: row.valor || "",
            data: row.data || "",
            categoria: row.categoria,
            metodo_pagamento: row.metodo_pagamento,
            parcelas: row.parcelas || "1",
            pago: row.pago || "true",
            descricao: row.descricao,
            fixo: row.fixo,
            mes_inicio: row.mes_inicio,
            mes_fim: row.mes_fim,
          };
        });

        setParsedRows(mappedRows);
        setCurrentPage(0);
        setResult(null);
      },
      error: (err) => {
        toast.error(`Erro ao ler arquivo: ${err.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (!parsedRows || parsedRows.length === 0) return;

    setImporting(true);
    try {
      const res = await importOperationsFromCsvAction(parsedRows, isIncome);
      setResult(res);

      if (res.imported > 0) {
        toast.success(`${res.imported} de ${res.total} operações importadas`);
        router.refresh();
        if (res.errors.length === 0) {
          setTimeout(() => {
            setDialogOpen(false);
            setParsedRows(null);
            setResult(null);
          }, 1500);
        }
      } else {
        toast.error("Nenhuma operação foi importada");
      }
    } catch (err) {
      toast.error(`Erro ao importar: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setParsedRows(null);
    setResult(null);
    setImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetFile = () => {
    setParsedRows(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalRows = parsedRows?.length ?? 0;
  const needsPagination = totalRows > 50;
  const pageCount = needsPagination ? Math.ceil(totalRows / PAGE_SIZE) : 1;
  const previewRows = parsedRows
    ? needsPagination
      ? parsedRows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
      : parsedRows
    : [];

  const parseFloatSafe = (val: string | undefined) => {
    if (!val) return 0;
    const cleaned = val
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    return Math.abs(parseFloat(cleaned)) * 100 || 0;
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setDialogOpen(true);
    }}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Importar de CSV</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importar {isIncome ? "Entradas" : "Saídas"} de CSV</DialogTitle>
          <DialogDescription>
            Selecione um arquivo CSV exportado do Nubank (colunas: date, title, amount)
            ou um CSV com as colunas: nome, valor, data, categoria (opcional),
            metodo_pagamento (opcional), parcelas (opcional), pago (opcional),
            descricao (opcional), fixo (opcional)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>

          {parsedRows && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {totalRows} linha(s) encontrada(s)
                {needsPagination && ` — página ${currentPage + 1} de ${pageCount}`}
              </p>

              <div className="border rounded-md max-h-60 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="max-w-32 truncate">{row.nome}</TableCell>
                        <TableCell>
                          {(parseFloatSafe(row.valor) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </TableCell>
                        <TableCell>{row.data}</TableCell>
                        <TableCell className="max-w-24 truncate">{row.categoria || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {needsPagination && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentPage + 1} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= pageCount - 1}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              )}

              {result && (
                <div className={`p-3 rounded-md text-sm ${result.errors.length === 0 ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}>
                  <p className="font-medium">
                    {result.imported} de {result.total} importadas com sucesso
                  </p>
                  {result.errors.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-xs">
                      {result.errors.slice(0, 10).map((e, i) => (
                        <li key={i}>Linha {e.row}: {e.message}</li>
                      ))}
                      {result.errors.length > 10 && (
                        <li>...e mais {result.errors.length - 10} erro(s)</li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {parsedRows && !result && (
            <>
              <Button variant="outline" onClick={resetFile} disabled={importing}>
                Escolher outro arquivo
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing && <Spinner />}
                {importing ? "Importando..." : `Importar ${parsedRows.length} linha(s)`}
              </Button>
            </>
          )}
          {result && (
            <Button variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
