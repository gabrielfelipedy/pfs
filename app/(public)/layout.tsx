import PublicNavbar from "@/components/shared/PublicNavbar";

// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNavbar/>
      {/* No Navbar here! */}
      {children}
    </div>
  );
}