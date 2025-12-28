// app/(main)/layout.tsx

import Navbar from "@/components/shared/Navbar";

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
      <main className="mt-16 md:mt-40">{children}</main>
    </>
  );
}
