import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const fromRoot = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@leaning-rct/core/jsx-dev-runtime": fromRoot(
        "./packages/core/src/jsx-runtime.ts",
      ),
      "@leaning-rct/core/jsx-runtime": fromRoot(
        "./packages/core/src/jsx-runtime.ts",
      ),
      "@leaning-rct/core/internal": fromRoot("./packages/core/src/internal.ts"),
      "@leaning-rct/dom/client": fromRoot("./packages/dom/src/client.ts"),
      "@leaning-rct/reconciler": fromRoot("./packages/reconciler/src/index.ts"),
      "@leaning-rct/scheduler": fromRoot("./packages/scheduler/src/index.ts"),
      "@leaning-rct/core": fromRoot("./packages/core/src/index.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
