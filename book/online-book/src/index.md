---
layout: home

hero:
  name: "leaning-rct"
  text: "React.jsを、一行ずつ作ろう。"
  tagline: JSXからFiber、Hooks、Effectまで。小さく動かし続けながら、Reactの内側を自分の手で確かめるオンラインブックです。
  actions:
    - theme: brand
      text: 学習を始める
      link: /00-introduction
    - theme: alt
      text: GitHubでコードを見る
      link: https://github.com/beryu/leaning-rct

features:
  - icon: "< />"
    title: JSX / React Elements
    details: JSXがどんなオブジェクトへ変換され、rendererへ届くのかを実装します。
  - icon: "Fx"
    title: Fiber / Reconciliation
    details: UIをFiber treeとして保持し、keyを使ってDOMを更新する流れを追います。
  - icon: "use"
    title: Hooks / State
    details: Hook linked list、更新キュー、effectのcleanupを小さく作ります。
  - icon: "t →"
    title: Scheduler / SSR
    details: 同期schedulerから始め、時間分割やSSRへ進む発展トラックです。
---

<div class="course-intro">

**最初のゴール:** 教材で作ったleaning-rctだけを使い、状態・イベント・リスト差分・副作用を備えたTodoアプリを動かします。

```tsx
import { useState } from "@leaning-rct/core";
import { createRoot } from "@leaning-rct/dom/client";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

createRoot(document.querySelector("#app")!).render(<Counter />);
```

</div>

## ブラウザだけで学べます

各章の演習はcloneやNode.jsを必要とせず、このオンラインブック上で編集・実行できます。編集内容は章ごとに同じブラウザのLocalStorageへ保存され、GitHubや外部サーバーへ送信されません。端末やブラウザを変えた場合は引き継がれず、ブラウザデータを削除すると消えます。いつでも演習の「リセット」で初期コードへ戻せます。

ローカル実行は、コントリビューターが本文や完成版runtimeを開発・検証するときに引き続き利用できます。

leaning-rctはReact、Meta、chibivueとは無関係の独立した教育プロジェクトです。Reactとの完全な互換性ではなく、読みやすさと内部構造の理解を優先しています。
