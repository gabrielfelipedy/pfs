import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardMockup from "./DashboardMockup";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden px-6 md:px-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-primary)_0%,transparent_70%)] opacity-15"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center pt-16 pb-20 text-center md:pt-24">
        <Badge variant="secondary" className="mb-6">
          Controle financeiro inteligente
        </Badge>

        <h1
          id="hero-title"
          className="title font-display text-balance max-w-3xl"
        >
          Insights inteligentes sobre o seu dinheiro!
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-muted-foreground md:text-lg">
          Reúna entradas, saídas, limites de gastos e investimentos em um só
          lugar — com gráficos claros para você decidir melhor todo mês.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button variant="default" size="lg" asChild>
            <Link href="/login">Fazer login</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#recursos">Ver recursos</a>
          </Button>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
