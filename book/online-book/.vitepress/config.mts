import { defineConfig } from "vitepress";

const base = process.env.VITEPRESS_BASE ?? "/leaning-rct/";
const repository = "https://github.com/beryu/leaning-rct";

export default defineConfig({
  lang: "ja-JP",
  title: "The leaning-rct Book",
  description: "React.jsを一行ずつ作りながら、内部構造を学ぶオンラインブック。",
  base,
  srcDir: "src",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: "https://beryu.github.io/leaning-rct/" },
  markdown: { lineNumbers: true },
  head: [
    ["meta", { name: "theme-color", content: "#0b2423" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "leaning-rct" }],
    ["meta", { property: "og:title", content: "The leaning-rct Book" }],
    [
      "meta",
      {
        property: "og:description",
        content: "React.jsを一行ずつ作りながら、内部構造を学ぶ。",
      },
    ],
    [
      "meta",
      { property: "og:url", content: "https://beryu.github.io/leaning-rct/" },
    ],
    ["meta", { name: "twitter:card", content: "summary" }],
  ],
  themeConfig: {
    siteTitle: "leaning-rct",
    nav: [
      { text: "ホーム", link: "/" },
      { text: "学習を始める", link: "/00-introduction" },
      {
        text: "Playground",
        link: `${repository}/tree/main/examples/playground`,
      },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [{ text: "1. はじめに", link: "/00-introduction" }],
      },
      {
        text: "Minimum leaning-rct",
        items: [
          { text: "2. 最初のレンダリング", link: "/10-first-render" },
          { text: "3. JSX", link: "/20-jsx" },
          { text: "4. コンポーネント", link: "/30-components" },
          { text: "5. 最小Fiber", link: "/40-fiber" },
          { text: "6. Reconciliation", link: "/50-reconciliation" },
          { text: "7. 最小Hooks", link: "/60-hooks" },
          { text: "8. Effect", link: "/70-effects" },
          { text: "9. Todoマイルストーン", link: "/80-milestone" },
        ],
      },
      {
        text: "Next Tracks",
        items: [{ text: "ロードマップ（WIP）", link: "/90-roadmap" }],
      },
    ],
    outline: { level: "deep", label: "このページ" },
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "検索", buttonAriaLabel: "ドキュメントを検索" },
          modal: {
            noResultsText: "見つかりませんでした",
            resetButtonTitle: "検索をリセット",
            footer: {
              selectText: "選択",
              navigateText: "移動",
              closeText: "閉じる",
            },
          },
        },
      },
    },
    socialLinks: [{ icon: "github", link: repository }],
    editLink: {
      pattern: `${repository}/edit/main/book/online-book/src/:path`,
      text: "このページを編集する",
    },
    lastUpdated: { text: "最終更新" },
    docFooter: { prev: "前の章", next: "次の章" },
    footer: {
      message:
        `Released under the <a href="${repository}/blob/main/LICENSE">MIT License</a>. This is an independent educational project and is not affiliated with Meta or React.`,
      copyright: "© 2026 Ryuta Kibe",
    },
  },
});
