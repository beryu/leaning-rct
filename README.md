# leaning-rct

React.jsを一行ずつ作りながら、その内部構造を学ぶ日本語オンラインブックです。

JSX、関数コンポーネント、同期Fiber、DOM reconciliation、`useState`、`useEffect`を、常に動く小さな実装として積み上げます。Reactとの完全互換ではなく、読みやすさと仕組みの理解を優先しています。

本プロジェクトは、Reactの仕組みを学習する目的で、OpenAIのGPT-5.6 Solを用いて作成しました。

## Online Book

公開先: <https://beryu.github.io/leaning-rct/>

オンラインブックの各章にはブラウザ演習があります。cloneやローカルサーバーなしでコードを編集・実行でき、編集内容は章ごとに同じブラウザのLocalStorageだけへ保存されます。GitHubや外部サーバーへは送信されません。端末・ブラウザを変えた場合は引き継がれず、ブラウザデータを削除すると消えます。「リセット」で章の初期コードへ戻せます。

ローカル実行はコントリビューターや完成版runtimeの開発向けに引き続き提供します。

## Quick Start

必要環境はNode.js 24以降とpnpm 10です。

```sh
pnpm install
pnpm dev       # オンラインブック
pnpm play      # leaning-rct製Todo Playground
pnpm test      # 単体テスト
pnpm check     # 公開前の全検査
```

## Repository

- `packages/core`: Element、JSX runtime、Hooks API
- `packages/reconciler`: Fiberとreconciliation
- `packages/dom`: DOM rendererと`createRoot`
- `packages/scheduler`: microtask scheduler
- `examples/playground`: 教材の完成実装で動くTodoアプリ
- `book/online-book`: VitePressオンラインブック
- `book/impls`: 章ごとの小さな実装チェックポイント

## Project policy

leaning-rctはReact、Meta、chibivueとは無関係の独立した教育プロジェクトです。[chibivue](https://github.com/chibivue-land/chibivue)の段階的な教材構造から着想を得ていますが、文章、コード、図版、ブランド資産は流用していません。

ReactはMeta Platforms, Inc.およびその関係者の商標または登録商標である可能性があります。本プロジェクトによる名称の使用は、提携や承認を意味しません。

コントリビューションは[CONTRIBUTING.md](CONTRIBUTING.md)、引用と出典の扱いは[ATTRIBUTION.md](ATTRIBUTION.md)、コミュニティ上の約束は[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)を参照してください。

## License

[MIT License](LICENSE)
