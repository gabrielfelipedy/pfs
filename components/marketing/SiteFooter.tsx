import Link from "next/link";

const footerLinks = [
  { href: "/", name: "Início" },
  { href: "/#recursos", name: "Recursos" },
  { href: "/#como-funciona", name: "Como funciona" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t px-6 md:px-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p translate="no" className="font-display text-2xl font-bold">
            pfs
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestão financeira pessoal.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-muted-foreground">© 2026 PFS</p>
      </div>
    </footer>
  );
}
