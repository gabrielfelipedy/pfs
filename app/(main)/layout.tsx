// app/(main)/layout.tsx

import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex justify-center">
        <Navbar />
      </header>
      <main className="mt-30 md:mt-40">{children}
        <Toaster />
      </main>
    </>
  );
}