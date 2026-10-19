const steps = [
  {
    title: "Registre suas operações",
    description:
      "Adicione entradas e saídas em poucos cliques, do jeito que você já faz no dia a dia.",
  },
  {
    title: "Acompanhe seus gráficos",
    description:
      "Veja a evolução do saldo e a comparação entre entradas e saídas em gráficos claros por mês.",
  },
  {
    title: "Ajuste limites e metas",
    description:
      "Defina limites de gastos por categoria e acompanhe a evolução dos seus investimentos.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="scroll-mt-24 border-y bg-muted/40 px-6 md:px-20"
    >
      <div className="mx-auto max-w-6xl py-16 md:py-24">
        <h2
          id="como-funciona-title"
          className="subtitle font-display text-balance text-center"
        >
          Como funciona
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-center text-muted-foreground md:text-lg">
          Três passos para ter o controle do seu dinheiro na palma da mão.
        </p>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-full bg-primary/15 font-display text-lg font-bold text-primary tabular-nums"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
