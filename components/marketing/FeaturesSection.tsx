import { ArrowLeftRight, Gauge, LayoutDashboard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard inteligente",
    description:
      "Acompanhe a evolução do seu saldo e a comparação entre entradas e saídas com gráficos mensais.",
  },
  {
    icon: ArrowLeftRight,
    title: "Operações no dia a dia",
    description:
      "Registre entradas e saídas e acompanhe resumos diários, semanais e mensais das suas finanças.",
  },
  {
    icon: Gauge,
    title: "Limites por categoria",
    description:
      "Defina limites de gastos por categoria e saiba sempre quanto ainda pode usar sem sair do planejado.",
  },
  {
    icon: TrendingUp,
    title: "Investimentos e metas",
    description:
      "Visualize o total investido, suas metas e a evolução histórica dos seus investimentos.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="recursos"
      aria-labelledby="recursos-title"
      className="scroll-mt-24 px-6 md:px-20"
    >
      <div className="mx-auto max-w-6xl py-16 md:py-24">
        <h2
          id="recursos-title"
          className="subtitle font-display text-balance text-center"
        >
          Tudo o que você precisa
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-center text-muted-foreground md:text-lg">
          Ferramentas simples e poderosas para entender e organizar sua vida
          financeira.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-colors hover:border-primary/50"
            >
              <CardHeader>
                <span
                  aria-hidden="true"
                  className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary"
                >
                  <feature.icon size={22} />
                </span>
                <CardTitle className="font-display text-lg">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
