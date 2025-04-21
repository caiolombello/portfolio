"use client";

import { useEffect, useCallback, RefObject } from "react";

interface UseKeyboardNavigationOptions {
  selector?: string;
  onEscape?: () => void;
  onEnter?: () => void;
  loop?: boolean;
}

export function useKeyboardNavigation(
  containerRef: RefObject<HTMLElement>,
  options: UseKeyboardNavigationOptions = {},
) {
  const {
    selector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    onEscape,
    onEnter,
    loop = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(selector),
      ) as HTMLElement[];

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement,
      );

      switch (event.key) {
        case "Tab":
          if (event.shiftKey) {
            if (currentIndex === 0) {
              if (loop) {
                event.preventDefault();
                focusableElements[focusableElements.length - 1]?.focus();
              }
            }
          } else {
            if (currentIndex === focusableElements.length - 1) {
              if (loop) {
                event.preventDefault();
                focusableElements[0]?.focus();
              }
            }
          }
          break;

        case "Escape":
          onEscape?.();
          break;

        case "Enter":
          onEnter?.();
          break;
      }
    },
    [containerRef, selector, onEscape, onEnter, loop],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, handleKeyDown]);
}
