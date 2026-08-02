"use client";

import { useState } from "react";
import { Check, Loader2, LogOut } from "lucide-react";

import { buildNewsletterApiEndpoint } from "@/lib/newsletter";

type TokenActionKind = "confirm" | "unsubscribe";
type Status = "idle" | "submitting" | "success" | "error";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,256}$/;

const copy = {
  confirm: {
    button: "Confirmar inscrição",
    submitting: "Confirmando...",
    fallback: "Não foi possível confirmar a inscrição.",
  },
  unsubscribe: {
    button: "Confirmar descadastro",
    submitting: "Descadastrando...",
    fallback: "Não foi possível concluir o descadastro.",
  },
} as const;

interface NewsletterTokenActionFormProps {
  kind: TokenActionKind;
  token: string | null;
  apiUrl: string;
}

export default function NewsletterTokenActionForm({
  kind,
  token,
  apiUrl,
}: NewsletterTokenActionFormProps) {
  const text = copy[kind];
  const validToken = token !== null && TOKEN_PATTERN.test(token);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  if (!validToken) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6 text-red-400"
      >
        Este link não é válido ou está incompleto. Solicite um novo e-mail de
        confirmação ou use o link da edição mais recente.
      </p>
    );
  }

  async function submitAction() {
    if (status === "submitting" || status === "success") return;
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch(
        buildNewsletterApiEndpoint(apiUrl, `/subscriptions/${kind}`),
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ token }),
        },
      );
      const body: unknown = await response.json().catch(() => null);
      const responseMessage =
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : text.fallback;

      if (!response.ok) throw new Error(responseMessage);
      setStatus("success");
      setMessage(responseMessage);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : text.fallback);
    }
  }

  const Icon = kind === "confirm" ? Check : LogOut;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={submitAction}
        disabled={status === "submitting" || status === "success"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 text-sm font-semibold text-background transition-[transform,opacity] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
        {status === "submitting" ? text.submitting : text.button}
      </button>

      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
          className={
            status === "success"
              ? "rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-400"
              : "rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6 text-red-400"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
