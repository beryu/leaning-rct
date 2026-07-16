# 2. 最初のレンダリング

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

`createRoot`へ文字列とElementを渡し、DOMへ表示できる最小の開発者インターフェースを作ります。

## 前提知識

DOMの`document.createElement`、`createTextNode`、`appendChild`を使います。React固有の知識はまだ必要ありません。

## React Elementを定義する

画面の設計図をDOMそのものではなく、通常のオブジェクトで表します。

```ts
type ChibiReactElement = {
  $$typeof: symbol;
  type: string | FunctionComponent;
  key: string | number | null;
  props: { children?: ChibiReactNode };
};
```

`$$typeof`はchibireactのElementであることを識別し、`type`は作る対象、`props`は入力、`key`は兄弟間の同一性を表します。

## 小さな実装

`createElement`は設定から`key`を分離し、可変長で受け取ったchildrenを一段の配列へ正規化します。rendererは文字列ならText node、文字列typeならElement nodeを作ります。

```ts
const root = createRoot(document.querySelector("#app")!);
root.render(createElement("h1", null, "Hello, chibireact!"));
```

render要求はmicrotaskへ積みます。同じ同期処理内で複数回呼んでも最後の状態を一度だけ描画できる土台になります。

## Playground確認

Playgroundのentrypointでは`createRoot(container).render(<TodoApp />)`を呼びます。まず一時的に文字列へ差し替え、Text nodeだけでも表示されることを確認できます。

## テスト

- `null`、booleanは描画しない。
- numberは文字列へ変換する。
- `unmount`でDOMを空にする。
- 無効なcontainerには明確な例外を返す。

## 本家Reactとの対応

React 19ではクライアントrootを`react-dom/client`の`createRoot`で作ります。chibireactもcoreとDOM入口を分離し、後で別rendererを作れる境界を残します。

章の実装: [`book/impls/10-first-render`](https://github.com/beryu/chibireact/tree/main/book/impls/10-first-render)
