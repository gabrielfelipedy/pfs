import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
        <nav>
          <Navbar linksClassName="px-20" />
        </nav>

        <main className=" px-20">
        {children}
        </main>
      </body>
    </html>
  );
}
