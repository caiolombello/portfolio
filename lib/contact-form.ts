export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  _gotcha?: string;
}

export type FormspreePayload = ContactSubmission & {
  "cf-turnstile-response": string;
};

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 254,
  message: 4000,
} as const;

export function getFormspreeErrorKey(
  status: number,
): "rateLimitMessage" | "errorMessage" {
  return status === 429 ? "rateLimitMessage" : "errorMessage";
}

export function buildFormspreePayload(
  formData: ContactSubmission,
  turnstileToken: string,
): FormspreePayload {
  if (!turnstileToken) {
    throw new Error("Turnstile verification is required");
  }

  return {
    ...formData,
    "cf-turnstile-response": turnstileToken,
  };
}
