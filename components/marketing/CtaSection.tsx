import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="px-6 md:px-20">
      <div className="mx-auto max-w-6xl py-16 text-center md:py-24">
        <h2 id="cta-title" className="subtitle font-display text-balance">
          Pronto para cuidar melhor do seu dinheiro?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground md:text-lg">
          Faça login e comece a acompanhar suas finanças com clareza.
        </p>
        <div className="mt-8">
          <Button variant="default" size="lg" asChild>
            <Link href="/login">Fazer login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
