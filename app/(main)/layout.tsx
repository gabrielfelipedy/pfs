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


      <Navbar />


      <main >{children}
        <Toaster />
      </main>
    </>
  );
}