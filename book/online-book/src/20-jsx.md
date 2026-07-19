<script setup>
import BrowserExercise from "../.vitepress/theme/components/BrowserExercise.vue";
import starter from "../../exercises/20-jsx/starter.tsx?raw";
</script>

# 3. JSX

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

JSXが`@leaning-rct/core/jsx-runtime`の呼び出しへ変換され、前章のElementになる経路を実装します。

## 前提知識

JSXはブラウザが直接実行するHTMLではありません。ViteとTypeScriptがJavaScriptへ変換します。

## automatic JSX runtime

`tsconfig.json`で次の設定を行います。

```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "@leaning-rct/core"
}
```

すると`<h1>Hello</h1>`は概ね次の呼び出しになります。

```ts
import { jsx } from "@leaning-rct/core/jsx-runtime";
jsx("h1", { children: "Hello" });
```

複数children用の`jsxs`と開発時の`jsxDEV`も同じElement生成関数へ接続します。

## 小さな実装

```ts
export function jsx(type, config, maybeKey) {
  const { key: configKey, ...props } = config;
  return {
    $$typeof: RCT_ELEMENT,
    type,
    key: maybeKey ?? configKey ?? null,
    props,
  };
}
```

`Fragment`は余分なDOM要素を作らずchildrenをまとめる特別なtypeです。

## ブラウザで実装する

`createElement`が返すElementを確認し、propsとchildrenをDOMとconsoleへ表示してください。

<ClientOnly><BrowserExercise title="JSXからElementを作る" storage-key="20-jsx" :initial-code="starter" /></ClientOnly>

## Playground確認

JSXを`createElement`呼び出しへ手で書き換え、生成されるElementをconsoleで比較すると、JSXが単なる構文変換であることを確認できます。

## テスト

Elementの`type`、`key`、`props.children`が期待どおりであることと、boolean childrenが除外されることを確認します。

## 本家Reactとの対応

本家Reactも`react/jsx-runtime`を公開します。leaning-rctでは開発用メタデータや所有者追跡を省き、変換の核だけを残します。

章の実装: [`book/impls/20-jsx`](https://github.com/beryu/leaning-rct/tree/main/book/impls/20-jsx)
