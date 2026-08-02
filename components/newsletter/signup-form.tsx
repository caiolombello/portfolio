"use client";

import { useCallback, useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { TurnstileWidget } from "@/components/turnstile-widget";
import { buildNewsletterApiEndpoint } from "@/lib/newsletter";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAAED3JUNqSRzUPVFs";

type Status = "idle" | "submitting" | "success" | "error";

const copy = {
  pt: {
    label: "Seu melhor e-mail",
    placeholder: "voce@empresa.com",
    submit: "Quero receber",
    submitting: "Enviando...",
    formLabel: "Inscrição na newsletter",
    challengePrompt: "Conclua a verificação para se inscrever.",
    challengeError: "Não foi possível carregar a verificação.",
    challengeRequired: "Conclua a verificação antes de continuar.",
    genericError: "Não foi possível processar sua inscrição.",
    consent:
      "Sem spam. A inscrição só é ativada após a confirmação enviada por e-mail, e você pode sair quando quiser.",
  },
  en: {
    label: "Your best email",
    placeholder: "you@company.com",
    submit: "Subscribe",
    submitting: "Sending...",
    formLabel: "Newsletter subscription",
    challengePrompt: "Complete the verification to subscribe.",
    challengeError: "The verification could not be loaded.",
    challengeRequired: "Complete the verification before continuing.",
    genericError: "Your subscription could not be processed.",
    consent:
      "No spam. Your subscription is activated only after email confirmation, and you can unsubscribe at any time.",
  },
} as const;

interface NewsletterSignupFormProps {
  locale: "pt" | "en";
  apiUrl: string;
}

export default function NewsletterSignupForm({
  locale,
  apiUrl,
}: NewsletterSignupFormProps) {
  const text = copy[locale];
  const [email, setEmail] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleVerify = useCallback((token: string) => {
    setChallengeToken(token);
    setStatus("idle");
    setMessage("");
  }, []);

  const handleChallengeReset = useCallback(() => {
    setChallengeToken("");
  }, []);

  const handleChallengeError = useCallback(() => {
    setChallengeToken("");
    setStatus("error");
    setMessage(copy[locale].challengeError);
  }, [locale]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    if (!challengeToken) {
      setStatus("error");
      setMessage(text.challengeRequired);
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch(
        buildNewsletterApiEndpoint(apiUrl, "/subscriptions"),
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ email, turnstileToken: challengeToken }),
        },
      );
      const body: unknown = await response.json().catch(() => null);
      const responseMessage =
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : text.genericError;
      if (!response.ok) throw new Error(responseMessage);

      setStatus("success");
      setMessage(responseMessage);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : text.genericError);
    } finally {
      setChallengeToken("");
      setResetKey((value) => value + 1);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-label={text.formLabel}
    >
      <div className="space-y-2">
        <label htmlFor="newsletter-email" className="text-sm font-medium">
          {text.label}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={text.placeholder}
          disabled={status === "submitting"}
          className="min-h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-base text-foreground shadow-inner outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:cursor-wait disabled:opacity-70"
        />
      </div>

      <div className="space-y-2">
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          action="newsletter-subscribe"
          resetKey={resetKey}
          errorMessage={text.challengeError}
          onVerify={handleVerify}
          onExpire={handleChallengeReset}
          onError={handleChallengeError}
        />
        {!challengeToken && status !== "error" && (
          <p className="text-xs leading-5 text-muted-foreground">
            {text.challengePrompt}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || !challengeToken}
        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 text-sm font-semibold text-background transition-[transform,opacity] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {text.submitting}
          </>
        ) : (
          <>
            {text.submit}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <p className="text-xs leading-5 text-muted-foreground">{text.consent}</p>

      {message && (
        <p
          className={
            status === "success"
              ? "rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              : "rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-400"
          }
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
