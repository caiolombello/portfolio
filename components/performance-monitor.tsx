"use client";

import { useEffect, useState } from "react";
import { initializePerformanceTracking } from "@/lib/performance";
import { logger } from "@/lib/logger";

interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cleanup = initializePerformanceTracking((metrics) => {
      logger.info("performance-monitor", "Performance metrics updated", {
        metrics: metrics.reduce((acc, metric) => ({
          ...acc,
          [metric.name]: { value: metric.value, rating: metric.rating }
        }), {})
      });
      setMetrics(metrics);
    });

    return () => {
      logger.debug("performance-monitor", "Cleaning up performance tracking");
      cleanup();
    };
  }, []);

  if (process.env.NODE_ENV !== "development" || metrics.length === 0) {
    return null;
  }

  const getRatingColor = (rating: PerformanceMetric["rating"]) => {
    switch (rating) {
      case "good":
        return "bg-green-500";
      case "needs-improvement":
        return "bg-yellow-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="rounded-full bg-primary p-2 text-primary-foreground shadow-lg"
        aria-label="Toggle performance metrics"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      </button>

      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-background p-4 shadow-lg">
          <h3 className="mb-2 font-semibold">Performance Metrics</h3>
          <div className="space-y-2">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{metric.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{Math.round(metric.value)}</span>
                  <div
                    className={`h-2 w-2 rounded-full ${getRatingColor(
                      metric.rating,
                    )}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
