import Link from "next/link";
import { ArrowLeft, Gauge, LayoutDashboard, TrendingUp } from "lucide-react";

const highlights = [
  {
    icon: LayoutDashboard,
    text: "Dashboard com gráficos de saldo, entradas e saídas",
  },
  {
    icon: Gauge,
    text: "Limites de gastos por categoria",
  },
  {
    icon: TrendingUp,
    text: "Acompanhamento de investimentos e metas",
  },
];

export default function LoginBranding() {
  return (
    <aside className="relative hidden overflow-hidden border-r bg-muted/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_20%_100%,var(--color-primary)_0%,transparent_70%)] opacity-15"
      />

      <p translate="no" className="font-display text-3xl font-bold">
        pfs
      </p>

      <div className="max-w-md">
        <h2 className="font-display text-3xl font-bold text-balance">
          Insights inteligentes sobre o seu dinheiro!
        </h2>
        <ul className="mt-8 flex flex-col gap-4">
          {highlights.map((highlight) => (
            <li key={highlight.text} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
              >
                <highlight.icon size={18} />
              </span>
              <span className="text-muted-foreground">{highlight.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para o início
      </Link>
    </aside>
  );
}
