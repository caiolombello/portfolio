"use client";

import { useState } from "react";
import { PerformanceMonitor } from "../performance-monitor";
import { A11yChecker } from "../a11y-checker";

interface DevToolbarProps {
  className?: string;
}

export function DevToolbar({ className }: DevToolbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      role="complementary"
      className={`fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg transition-transform ${
        isCollapsed ? "translate-y-full" : ""
      } ${className ?? ""}`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-full bg-primary p-2 text-primary-foreground"
              aria-label="toggle toolbar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transform transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
            <span className="text-sm font-medium">Development Tools</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-muted-foreground hover:text-foreground"
              aria-label="Reload page"
            >
              Reload
            </button>
            <button
              onClick={() => localStorage.clear()}
              className="text-sm text-muted-foreground hover:text-foreground"
              aria-label="clear storage"
            >
              Clear Storage
            </button>

          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-sm font-medium">Performance</h3>
              <PerformanceMonitor />
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-sm font-medium">Accessibility</h3>
              <A11yChecker />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
