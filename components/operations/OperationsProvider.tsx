"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Operation } from "@/lib/definitions";
import { fetchOperationsAction } from "@/actions/fetch-operations";
import { INVESTIMENTO_CATEGORY_ID } from "@/lib/operation";

interface OperationsContextValue {
  operations: Operation[];
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

const OperationsContext = createContext<OperationsContextValue | null>(null);

export function OperationsProvider({
  initialOperations,
  children,
}: {
  initialOperations: Operation[];
  children: ReactNode;
}) {
  const [operations, setOperations] = useState<Operation[]>(initialOperations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOperationsAction();
      setOperations(data);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ operations, loading, error, refresh }),
    [operations, loading, error, refresh]
  );

  return (
    <OperationsContext.Provider value={value}>
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) {
    throw new Error("useOperations must be used within an OperationsProvider");
  }
  return ctx;
}

export function useIncomes(): Operation[] {
  const { operations } = useOperations();
  return useMemo(
    () => operations.filter((op) => op.is_income === true),
    [operations]
  );
}

export function useExpenses(): Operation[] {
  const { operations } = useOperations();
  return useMemo(
    () => operations.filter((op) => op.is_income === false),
    [operations]
  );
}

export function useInvestments(): Operation[] {
  const { operations } = useOperations();
  return useMemo(
    () =>
      operations.filter(
        (op) => op.category_id === INVESTIMENTO_CATEGORY_ID
      ),
    [operations]
  );
}
