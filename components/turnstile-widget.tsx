"use client";

import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "dark";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

type TurnstileWindow = Window & { turnstile?: TurnstileApi };
let scriptPromise: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
  const turnstileWindow = window as TurnstileWindow;
  if (turnstileWindow.turnstile) {
    return Promise.resolve(turnstileWindow.turnstile);
  }

  if (scriptPromise) return scriptPromise;

  const pendingScript = new Promise<TurnstileApi>((resolve, reject) => {
    const resolveApi = () => {
      if (turnstileWindow.turnstile) resolve(turnstileWindow.turnstile);
      else reject(new Error("Turnstile API was not initialized"));
    };
    const rejectLoad = () => reject(new Error("Failed to load Turnstile"));
    const existingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", resolveApi, { once: true });
      existingScript.addEventListener("error", rejectLoad, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", resolveApi, { once: true });
    script.addEventListener("error", rejectLoad, { once: true });
    document.head.appendChild(script);
  });
  const loadResult = pendingScript.catch((error) => {
    document.getElementById(TURNSTILE_SCRIPT_ID)?.remove();
    scriptPromise = undefined;
    throw error;
  });
  scriptPromise = loadResult;

  return loadResult;
}

interface TurnstileWidgetProps {
  siteKey: string;
  resetKey: number;
  errorMessage: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}

export function TurnstileWidget({
  siteKey,
  resetKey,
  errorMessage,
  onVerify,
  onExpire,
  onError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const apiRef = useRef<TurnstileApi | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    loadTurnstile()
      .then((api) => {
        if (!active || !containerRef.current || widgetIdRef.current) return;
        apiRef.current = api;
        widgetIdRef.current = api.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "flexible",
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
        });
      })
      .catch(() => {
        if (active) {
          setLoadError(true);
          onError();
        }
      });

    return () => {
      active = false;
      if (widgetIdRef.current && apiRef.current) {
        apiRef.current.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [onError, onExpire, onVerify, siteKey]);

  useEffect(() => {
    if (widgetIdRef.current && apiRef.current) {
      apiRef.current.reset(widgetIdRef.current);
    }
  }, [resetKey]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full" />
      {loadError && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
