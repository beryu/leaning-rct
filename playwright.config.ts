import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { trace: "on-first-retry" },
  projects: [
    {
      name: "playground",
      testMatch: "playground.spec.ts",
      use: { baseURL: "http://127.0.0.1:4173" },
    },
    {
      name: "book",
      testMatch: "book.spec.ts",
      use: { baseURL: "http://127.0.0.1:4174/leaning-rct/" },
    },
  ],
  webServer: [
    {
      command:
        "node node_modules/vite/bin/vite.js examples/playground --host 127.0.0.1 --port 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "pnpm book:build && node node_modules/vitepress/bin/vitepress.js preview book/online-book --host 127.0.0.1 --port 4174",
      url: "http://127.0.0.1:4174/leaning-rct/",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
