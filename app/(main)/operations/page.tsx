import OperationsPageContent from "./components/OperationsPageContent";
import { OperationTab } from "./components/tabConfig";

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: OperationTab = tab === "entradas" ? "entradas" : "saidas";

  return <OperationsPageContent initialTab={initialTab} />;
}
