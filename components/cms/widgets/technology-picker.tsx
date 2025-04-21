"use client";

import { useState } from "react";
import { CmsWidgetControlProps } from "decap-cms-core";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const commonTechs = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Django",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
];

export function TechnologyPicker({
  value = [],
  onChange,
}: CmsWidgetControlProps) {
  const [customTech, setCustomTech] = useState("");

  const handleAddTech = (tech: string) => {
    if (!value.includes(tech)) {
      onChange([...value, tech]);
    }
  };

  const handleRemoveTech = (tech: string) => {
    onChange(value.filter((t: string) => t !== tech));
  };

  const handleCustomTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTech.trim() && !value.includes(customTech.trim())) {
      handleAddTech(customTech.trim());
      setCustomTech("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {value.map((tech: string) => (
          <Badge
            key={tech}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tech}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => handleRemoveTech(tech)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {commonTechs.map((tech) => (
            <Button
              key={tech}
              variant="outline"
              size="sm"
              onClick={() => handleAddTech(tech)}
              disabled={value.includes(tech)}
            >
              {tech}
            </Button>
          ))}
        </div>

        <form onSubmit={handleCustomTechSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add custom technology..."
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!customTech.trim()}>
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
