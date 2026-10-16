"use client";

import { useMemo, useState } from "react";
import FormDialog from "@/components/dialogs/FormDialog";
import { Operation, OperationArray, ChartData } from "@/lib/definitions";
import { operationValue } from "@/lib/parcelamento";
import { isAtualOperation } from "@/lib/operation";
import ErrorLoading from "@/components/error/ErrorLoading";
import { useOperations } from "@/components/operations/OperationsProvider";
import {
  filterOperationsByMonth,
  filterOperationsByMonthCharts,
  getAvaliableMonths,
  formatMonthYear,
  todayInUtcMinus3,
  toUtcMinus3Instant,
} from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScrollableTabsList from "@/components/shared/ScrollableTabsList";
import ReducedOperationDataTable from "@/components/data-table/ReducedOperationDataTable";
import FixedExpensesDataTable from "@/components/data-table/FixedExpensesDataTable";
import { EmptyDemo } from "@/components/empty/EmptyDemo";
import ImportCsvDialog from "@/components/dialogs/ImportCsvDialog";
import Heatmap from "@/components/charts/heatmap";
import OperationsResumeCards from "./OperationsResumeCards";
import MonthlyOperationsCharts from "./MonthlyOperationsCharts";
import { OperationTab, operationsTabConfig } from "./tabConfig";

function calculateYearlyOperationsMap(operations: Operation[]): ChartData[] {
  const today = toUtcMinus3Instant(new Date());

  const end = operations.reduce((latest, op) => {
    const opDate = toUtcMinus3Instant(new Date(op.date ?? ""));
    return opDate > latest ? opDate : latest;
  }, today);

  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  start.setUTCDate(start.getUTCDate() + 1);

  const operationsMap = new Map<string, number>();

  const cursor = new Date(start);
  while (cursor <= end) {
    const key = cursor.toISOString().split("T")[0];
    operationsMap.set(key, 0);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  operations.forEach((op) => {
    const date = new Date(op.date ?? "");
    const key = date.toISOString().split("T")[0];
    if (operationsMap.has(key)) {
      operationsMap.set(key, (operationsMap.get(key) ?? 0) + operationValue(op) / 100);
    }
  });

  return Array.from(operationsMap.entries()).map(([date, value]) => ({ date, value }));
}

interface Props {
  initialTab: OperationTab;
}

export default function OperationsPageContent({ initialTab }: Props) {
  const { operations, error } = useOperations();
  const [tab, setTab] = useState<OperationTab>(initialTab);
  const [mode, setMode] = useState<"atual" | "previsto">("atual");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const config = operationsTabConfig[tab];
  const isIncome = config.isIncome;

  const filtered = useMemo(
    () => operations.filter((op) => op.is_income === isIncome),
    [operations, isIncome]
  );

  if (error) return <ErrorLoading />;

  const filteredArray = new OperationArray(filtered);
  const paidOnly = mode === "atual";

  const avaliableMonths = getAvaliableMonths(filtered);
  const currentDate = todayInUtcMinus3();
  const actualMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
  const month = selectedMonth && avaliableMonths.includes(selectedMonth)
    ? selectedMonth
    : actualMonth;

  const heatmapOperations = filtered.filter((op) => !paidOnly || isAtualOperation(op));
  const heatmapData = calculateYearlyOperationsMap(heatmapOperations);

  const handleTabChange = (value: string) => {
    const next = value as OperationTab;
    setTab(next);
    setSelectedMonth(null);
    window.history.replaceState(null, "", `/operations?tab=${next}`);
  };

  const emptyOperation: Operation = {
    name: config.emptyOperation.name,
    value: config.emptyOperation.value,
    parcelas: config.emptyOperation.parcelas,
    date: new Date(),
    is_income: config.emptyOperation.is_income,
  };

  return (
    <>
      <h1 className="text-[3rem] font-bold mt-10">{config.title}</h1>

      <Tabs className="mt-4" value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="saidas">Saídas</TabsTrigger>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
        </TabsList>
      </Tabs>

      <Heatmap
        title={config.heatmap.title}
        description={config.heatmap.description}
        className="mt-10"
        data={heatmapData}
        valueLabel={config.heatmap.valueLabel}
        colorRange={config.heatmap.colorRange}
      />

      <Tabs className="mt-4" value={month} onValueChange={setSelectedMonth}>
        <ScrollableTabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap h-auto p-1 scrollbar-hide">
          {avaliableMonths.map((m) => (
            <TabsTrigger key={m} value={m} className="shrink-0">
              {formatMonthYear(m)}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
        {avaliableMonths.map((m) => (
          <TabsContent key={m} value={m}>

            <OperationsResumeCards
              operations={operations}
              filtered={filtered}
              month={m}
              mode={mode}
              onModeChange={setMode}
              config={config}
              className="mt-10"
            />

            <MonthlyOperationsCharts
              operations={filterOperationsByMonthCharts(filtered, m)}
              month={m}
              paidOnly={paidOnly}
              config={config}
              className="mt-10"
            />

            <div className="mt-10">
              <FormDialog
                openDialogText={config.addOperation.openDialogText}
                dialogTitle={config.addOperation.dialogTitle}
                dialogDescription={config.addOperation.dialogDescription}
                buttonText={config.addOperation.buttonText}
                operation={emptyOperation}
                actionFunction={config.createAction}
              />
            </div>

            <h2 className="subtitle mt-10">{config.fixed.sectionTitle}</h2>

            <div className="mt-2">
              {(() => {
                const fixedFiltered = filterOperationsByMonth(filteredArray.filterFixedOperations().getOperations(), m)

                if (fixedFiltered.length === 0) {
                  return <EmptyDemo
                    title={config.fixed.emptyTitle}
                    description={config.fixed.emptyDescription}
                    createButtonText={config.fixed.emptyCreateButtonText}
                    importButtonText={config.importButtonText}
                    createButton={
                      <FormDialog
                        openDialogText={config.fixed.createDialog.openDialogText}
                        dialogTitle={config.fixed.createDialog.dialogTitle}
                        dialogDescription={config.fixed.createDialog.dialogDescription}
                        buttonText={config.fixed.createDialog.buttonText}
                        operation={emptyOperation}
                        actionFunction={config.createAction}
                      />
                    }
                    importButton={<ImportCsvDialog isIncome={isIncome} />}
                  />
                }

                return <FixedExpensesDataTable key={isIncome ? "entradas" : "saidas"} operations={fixedFiltered} />
              })()}
            </div>

            <h2 className="subtitle mt-10">{config.variable.sectionTitle}</h2>

            <div className="mt-2">
              {(() => {
                const variableOps = filteredArray.filterVariableOperations().filterOperationsByMonth(m).reverse();
                if (variableOps.length === 0) {
                  return (
                    <EmptyDemo
                      title={config.variable.emptyTitle}
                      description={config.variable.emptyDescription}
                      createButtonText={config.variable.emptyCreateButtonText}
                      importButtonText={config.importButtonText}
                      createButton={
                        <FormDialog
                          openDialogText={config.variable.createDialog.openDialogText}
                          dialogTitle={config.variable.createDialog.dialogTitle}
                          dialogDescription={config.variable.createDialog.dialogDescription}
                          buttonText={config.variable.createDialog.buttonText}
                          operation={emptyOperation}
                          actionFunction={config.createAction}
                        />
                      }
                      importButton={<ImportCsvDialog isIncome={isIncome} />}
                    />
                  );
                }
                return <ReducedOperationDataTable key={isIncome ? "entradas" : "saidas"} operations={variableOps} />;
              })()}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};
