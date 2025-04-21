"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ImpactValue } from "axe-core";

interface A11yIssue {
  id: string;
  impact: ImpactValue | undefined;
  description: string;
  help: string;
  helpUrl: string;
  nodes: { html: string }[];
}

export function A11yChecker() {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkAccessibility = async () => {
    try {
      const axe = (await import("axe-core")).default;
      const results = await axe.run(document);

      const formattedIssues: A11yIssue[] = results.violations.map(
        (violation) => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.map((node) => ({
            html: node.html,
          })),
        }),
      );

      setIssues(formattedIssues);
    } catch (error) {
      console.error("Error checking accessibility:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      checkAccessibility();
    }
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accessibility Issues</h2>
            <Button
              onClick={checkAccessibility}
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              {isChecking ? "Checking..." : "Check Now"}
            </Button>
          </div>
          {issues.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="mb-4 border-b pb-4 last:border-0"
                >
                  <h3 className="font-medium text-destructive">
                    {issue.description}
                  </h3>
                  <p className="text-sm text-muted-foreground">{issue.help}</p>
                  <a
                    href={issue.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Learn more
                  </a>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Affected elements:</h4>
                    {issue.nodes.map((node, index) => (
                      <pre
                        key={index}
                        className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs"
                      >
                        {node.html}
                      </pre>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No accessibility issues found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
