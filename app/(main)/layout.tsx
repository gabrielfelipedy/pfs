import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { OperationsProvider } from "@/components/operations/OperationsProvider";
import { getOperations } from "@/db/queries/operation";
import ErrorLoading from "@/components/error/ErrorLoading";
import { verifySession } from "@/lib/session";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username } = await verifySession();

  let operations;

  try {
    operations = await getOperations();
  } catch (error) {
    console.error(error);
    return <ErrorLoading />;
  }

  return (
    <OperationsProvider initialOperations={operations}>
      <Navbar username={username} />

      <main className="px-6 md:px-20 mt-40 pb-40">
        {children}
        <Toaster />
      </main>
    </OperationsProvider>
  );
}
