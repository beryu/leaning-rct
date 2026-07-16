---
layout: home

hero:
  name: "chibireact"
  text: "React.jsを、一行ずつ作ろう。"
  tagline: JSXからFiber、Hooks、Effectまで。小さく動かし続けながら、Reactの内側を自分の手で確かめるオンラインブックです。
  actions:
    - theme: brand
      text: 学習を始める
      link: /00-introduction
    - theme: alt
      text: GitHubでコードを見る
      link: https://github.com/beryu/chibireact

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

**最初のゴール:** 教材で作ったchibireactだけを使い、状態・イベント・リスト差分・副作用を備えたTodoアプリを動かします。

```tsx
import { useState } from "chibireact";
import { createRoot } from "chibireact-dom/client";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

createRoot(document.querySelector("#app")!).render(<Counter />);
```

</div>

chibireactはReact、Meta、chibivueとは無関係の独立した教育プロジェクトです。Reactとの完全な互換性ではなく、読みやすさと内部構造の理解を優先しています。
