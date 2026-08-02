import type { Metadata } from "next";
import Link from "next/link";
import { MailMinus } from "lucide-react";

import NewsletterTokenActionForm from "@/components/newsletter/token-action-form";
import { getNewsletterApiUrl } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Descadastrar | Radar de Produção",
  description: "Cancele o recebimento da newsletter Radar de Produção.",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/unsubscribe" },
};

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token: tokenValue } = await searchParams;
  const token = typeof tokenValue === "string" ? tokenValue : null;

  return (
    <main className="container flex min-h-[68vh] items-center justify-center py-16 sm:py-24">
      <section className="w-full max-w-lg rounded-2xl border border-border/80 bg-card/55 p-6 shadow-2xl shadow-black/10 sm:p-9">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
          <MailMinus className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Radar de Produção
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Parar de receber a newsletter
        </h1>
        <p className="mb-7 mt-4 text-sm leading-6 text-muted-foreground">
          O descadastro é imediato. Você poderá se inscrever novamente quando
          quiser.
        </p>

        <NewsletterTokenActionForm
          kind="unsubscribe"
          token={token}
          apiUrl={getNewsletterApiUrl()}
        />

        <Link
          href="/newsletter"
          className="mt-6 inline-flex text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          Voltar ao Radar de Produção
        </Link>
      </section>
    </main>
  );
}
