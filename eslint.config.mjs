import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "@next/next/no-img-element": "warn",
      "@next/next/google-font-preconnect": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unexpected-multiline": "warn",
      "prefer-const": "warn",
    },
  },
  {
    files: ["components/ui/chart.tsx"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
  {
    files: ["lib/logger.ts", "lib/performance.ts"],
    rules: { "no-console": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "public/**",
    "node_modules/**",
    "next-env.d.ts",
    "**/*.config.js",
    "**/*.config.ts",
  ]),
]);
