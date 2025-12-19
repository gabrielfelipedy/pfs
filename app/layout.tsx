import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PFS",
  description: "Financial system to manage your personal finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <header>
          <Navbar linksClassName="px-6 md:px-20" />
        </header>

        <main className="px-6 md:px-20 mt-20">
        {children}
        <Toaster />
        </main>
      </body>
    </html>
  );
}
