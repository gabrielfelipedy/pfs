import OperationsPageContent from "./components/OperationsPageContent";
import { OperationTab } from "./components/tabConfig";

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: OperationTab =
    tab === "entradas" || tab === "saidas" ? tab : "saldo";

  return <OperationsPageContent initialTab={initialTab} />;
}
