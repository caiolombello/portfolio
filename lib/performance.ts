import { onCLS, onFID, onLCP, onTTFB } from "web-vitals";
import { logger } from "@/lib/logger";

type MetricName = "CLS" | "FID" | "LCP" | "TTFB";

interface Metric {
  name: MetricName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: MetricName, value: number): Metric["rating"] {
  const threshold = thresholds[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

function sendToAnalytics(metric: Metric, onUpdate?: (metrics: Metric[]) => void) {
  // Replace with your analytics service
  console.log("[Performance]", metric);

  // Example: Send to Google Analytics
  if (typeof window !== "undefined" && "gtag" in window) {
    const gtag = (window as Window & { gtag: (command: string, event: string, params: Record<string, unknown>) => void }).gtag;
    gtag("event", "web_vitals", {
      event_category: "Web Vitals",
      event_label: metric.name,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }

  // Call the update callback if provided
  if (onUpdate) {
    // Get all metrics and call the callback
    const allMetrics = Object.entries(metricsStore).map(([name, value]) => ({
      name: name as MetricName,
      value,
      rating: getRating(name as MetricName, value),
    }));
    onUpdate(allMetrics);
  }
}

// Store for keeping track of the latest metrics
const metricsStore: Partial<Record<MetricName, number>> = {};

export function initializePerformanceTracking(onUpdate?: (metrics: Metric[]) => void) {
  try {
    onCLS((metric) => {
      metricsStore.CLS = metric.value;
      sendToAnalytics({
        name: "CLS",
        value: metric.value,
        rating: getRating("CLS", metric.value),
      }, onUpdate);
    });

    onFID((metric) => {
      metricsStore.FID = metric.value;
      sendToAnalytics({
        name: "FID",
        value: metric.value,
        rating: getRating("FID", metric.value),
      }, onUpdate);
    });

    onLCP((metric) => {
      metricsStore.LCP = metric.value;
      sendToAnalytics({
        name: "LCP",
        value: metric.value,
        rating: getRating("LCP", metric.value),
      }, onUpdate);
    });

    onTTFB((metric) => {
      metricsStore.TTFB = metric.value;
      sendToAnalytics({
        name: "TTFB",
        value: metric.value,
        rating: getRating("TTFB", metric.value),
      }, onUpdate);
    });

    // Return a cleanup function
    return () => {
      // Clear the metrics store
      Object.keys(metricsStore).forEach(key => delete metricsStore[key as MetricName]);
    };
  } catch (error) {
    console.error("[Performance] Failed to initialize tracking:", error);
    return () => {}; // Return empty cleanup function
  }
}

export function reportPerformanceMetric(name: string, value: number) {
  const rating = getRating(name as MetricName, value);
  logger.info("performance", `Metric: ${name}`, { value, rating });
  return { name, value, rating };
}
