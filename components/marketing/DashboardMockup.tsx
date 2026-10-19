import { formatter } from "@/lib/utils";

const bars = [
  { height: "h-10", opacity: "bg-primary/50" },
  { height: "h-14", opacity: "bg-primary/60" },
  { height: "h-9", opacity: "bg-primary/50" },
  { height: "h-18", opacity: "bg-primary/80" },
  { height: "h-12", opacity: "bg-primary/60" },
  { height: "h-20", opacity: "bg-primary" },
  { height: "h-15", opacity: "bg-primary/70" },
  { height: "h-22", opacity: "bg-primary" },
  { height: "h-13", opacity: "bg-primary/60" },
  { height: "h-17", opacity: "bg-primary/80" },
  { height: "h-11", opacity: "bg-primary/50" },
  { height: "h-19", opacity: "bg-primary/90" },
];

export default function DashboardMockup() {
  return (
    <div
      role="img"
      aria-label="Prévia do painel do PFS com saldo, entradas, saídas e gráfico de evolução mensal"
      className="mx-auto mt-14 w-full max-w-3xl rounded-xl border bg-card text-left shadow-lg shadow-primary/5"
    >
      <div className="flex items-center gap-1.5 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/60" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-chart-4/60" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-primary/60" aria-hidden="true" />
      </div>

      <div className="p-5 md:p-6">
        <p className="text-sm text-muted-foreground">Saldo total</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-3">
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {formatter.format(12480.5)}
          </p>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary tabular-nums">
            +12,4% este mês
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Entradas</p>
            <p className="mt-1 truncate text-sm font-semibold text-primary tabular-nums">
              {formatter.format(8200)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Saídas</p>
            <p className="mt-1 truncate text-sm font-semibold text-destructive tabular-nums">
              {formatter.format(3120.45)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Investido</p>
            <p className="mt-1 truncate text-sm font-semibold tabular-nums">
              {formatter.format(25600)}
            </p>
          </div>
        </div>

        <div
          className="mt-6 flex h-24 items-end gap-1.5 md:h-28"
          aria-hidden="true"
        >
          {bars.map((bar, index) => (
            <div
              key={index}
              className={`w-full rounded-t-sm ${bar.height} ${bar.opacity}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
