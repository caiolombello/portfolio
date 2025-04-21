"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { language } = useLanguage();

  const translateCategory = (category: string) => {
    if (category === "All") {
      return language === "en" ? "All" : "Todos";
    }
    return category;
  };

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={
            activeCategory === category ? "bg-gold hover:bg-gold/90" : ""
          }
        >
          {translateCategory(category)}
        </Button>
      ))}
    </div>
  );
}
