import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { OperationsProvider } from "@/components/operations/OperationsProvider";
import { getOperations } from "@/db/queries/operation";
import ErrorLoading from "@/components/error/ErrorLoading";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let operations;

  try {
    operations = await getOperations();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  return (
    <OperationsProvider initialOperations={operations}>
      <Navbar />

      <main className="px-6 md:px-20 mt-40 pb-40">
        {children}
        <Toaster />
      </main>
    </OperationsProvider>
  );
}
