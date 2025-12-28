// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* No Navbar here! */}
      {children}
    </div>
  );
}