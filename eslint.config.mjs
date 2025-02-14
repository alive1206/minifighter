import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-var": 0,
      "@typescript-eslint/no-explicit-any": "off",
      "react/jsx-key": [1, { checkFragmentShorthand: true }],
    },
  },
];

export default eslintConfig;
