"use client";

import type React from "react";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/language-context";
import { TurnstileWidget } from "@/components/turnstile-widget";
import {
  buildFormspreePayload,
  CONTACT_FIELD_LIMITS,
  getFormspreeErrorKey,
  type ContactSubmission,
} from "@/lib/contact-form";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
  "0x4AAAAAAED3JUNqSRzUPVFs";

type FormData = ContactSubmission;

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    _gotcha: "", // initialize honeypot
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setErrorMessage("");
    setSubmitStatus((status) => (status === "error" ? "idle" : status));
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken("");
    setSubmitStatus("error");
    setErrorMessage(t("turnstileError"));
  }, [t]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = t("nameRequired");
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalidEmail");
    }

    // Validar mensagem
    if (!formData.message.trim()) {
      newErrors.message = t("messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("messageMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!turnstileToken) {
      setSubmitStatus("error");
      setErrorMessage(t("turnstileRequired"));
      return;
    }

    setSubmitStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/meqwnard", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          buildFormspreePayload(formData, turnstileToken),
        ),
      });

      if (!response.ok) {
        throw new Error(t(getFormspreeErrorKey(response.status)));
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "", _gotcha: "" });

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t("errorMessage"),
      );

      setTimeout(() => {
        setSubmitStatus("idle");
        setErrorMessage("");
      }, 5000);
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field - hidden from real users but visible to bots */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        aria-hidden="true"
        value={formData._gotcha}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground"
        >
          {t("name")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          maxLength={CONTACT_FIELD_LIMITS.name}
          disabled={submitStatus === "submitting"}
          className={`w-full rounded-md border ${
            errors.name ? "border-red-500" : "border-border"
          } bg-background px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors disabled:opacity-70`}
          placeholder={t("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          {t("email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          maxLength={CONTACT_FIELD_LIMITS.email}
          disabled={submitStatus === "submitting"}
          className={`w-full rounded-md border ${
            errors.email ? "border-red-500" : "border-border"
          } bg-background px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors disabled:opacity-70`}
          placeholder={t("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          disabled={submitStatus === "submitting"}
          rows={5}
          maxLength={CONTACT_FIELD_LIMITS.message}
          className={`w-full rounded-md border ${
            errors.message ? "border-red-500" : "border-border"
          } bg-background px-4 py-2 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors disabled:opacity-70`}
          placeholder={t("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {t("privacyNotice")} {" "}
        <a
          href="https://formspree.io/legal/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("privacyPolicy")}
        </a>
      </p>

      <div className="space-y-2">
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          resetKey={turnstileResetKey}
          errorMessage={t("turnstileLoadError")}
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
          onError={handleTurnstileError}
        />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {turnstileToken ? t("turnstileVerified") : t("turnstilePrompt")}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={submitStatus === "submitting" || !turnstileToken}
      >
        {submitStatus === "submitting" ? (
          <>
            <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("send")
        )}
      </Button>

      {submitStatus === "success" && (
        <div
          className="rounded-md bg-green-900/20 p-4 text-center text-green-400 animate-in fade-in"
          role="alert"
          aria-live="polite"
        >
          {t("successMessage")}
        </div>
      )}

      {submitStatus === "error" && (
        <div
          className="rounded-md bg-red-900/20 p-4 text-center text-red-400 animate-in fade-in"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage || t("errorMessage")}
        </div>
      )}
    </form>
  );
}
