# 5. 最小Fiber

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

Elementの一時的な木とは別に、前回の状態とDOM nodeを保持するFiber treeを作ります。

## 前提知識

Elementは毎回新しく作られます。更新前後を結び付けるには、レンダーを越えて生きるデータ構造が必要です。

## Fiber node

```ts
type Fiber = {
  tag: "root" | "host" | "text" | "function" | "fragment";
  type: ElementType | null;
  key: Key;
  stateNode: Node | null;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
};
```

`return`、`child`、`sibling`で木を表し、`stateNode`がDOM、`alternate`が前回のFiberを指します。

## render phaseとcommit phase

render phaseでは次のFiber treeを作り、必要なDOMを準備します。commit phaseでは親DOM内のHost nodeを次の順序へ並べます。初回実装は同期的ですが、責務を分けることで後からschedulerを差し込めます。

## Playground確認

関数コンポーネント自身はDOMを持ちません。`TodoApp → main → section`というFiber chainと、実際のDOM treeの違いをdebuggerで観察します。

## テスト

関数コンポーネントとFragmentを挟んでもHost nodeが正しい親へ配置され、更新時に同じDOM nodeが再利用されることを確認します。

## 本家Reactとの対応

本家ではwork loopを中断・再開でき、flagsをcommit phaseで処理します。leaning-rctは読みやすさのため再帰処理と即時DOM準備を使いますが、current/alternateとphaseの境界は維持します。

章の実装: [`book/impls/40-fiber`](https://github.com/beryu/leaning-rct/tree/main/book/impls/40-fiber)
