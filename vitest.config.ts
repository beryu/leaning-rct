import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const fromRoot = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "chibireact/jsx-dev-runtime": fromRoot(
        "./packages/chibireact/src/jsx-runtime.ts",
      ),
      "chibireact/jsx-runtime": fromRoot(
        "./packages/chibireact/src/jsx-runtime.ts",
      ),
      "chibireact/internal": fromRoot("./packages/chibireact/src/internal.ts"),
      "chibireact-dom/client": fromRoot(
        "./packages/chibireact-dom/src/client.ts",
      ),
      "@chibireact/reconciler": fromRoot("./packages/reconciler/src/index.ts"),
      "@chibireact/scheduler": fromRoot("./packages/scheduler/src/index.ts"),
      chibireact: fromRoot("./packages/chibireact/src/index.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
