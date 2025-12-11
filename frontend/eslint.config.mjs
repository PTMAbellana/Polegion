import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Prevent console.log in production code
      // Use logger from @/utils/logger instead
      "no-console": ["warn", { 
        allow: ["error"] // Only allow console.error
      }],
    },
  },
];

export default eslintConfig;
