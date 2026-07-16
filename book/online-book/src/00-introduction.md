# 1. はじめに

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

この本のゴール、前提知識、Reactを構成する責務を把握し、どの順番で実装するか説明できるようになります。

## 前提知識

読者はReactで関数コンポーネントを書いた経験と、TypeScriptの基本的な型・関数・配列操作を知っているものとします。Fiberやcompilerの知識は必要ありません。

## Reactを三つの責務へ分ける

この本ではReactの仕事を次の三つへ分けて考えます。

1. **core**: Element、JSX runtime、Hooksという開発者向けAPIを提供する。
2. **reconciler**: 前回と次回のUIをFiber treeとして比較し、必要な変更を決める。
3. **renderer**: reconcilerの決定をDOMへ反映する。

Schedulerは「いつreconcilerを動かすか」を担当します。最初はmicrotask単位の同期処理だけを実装し、時間分割は発展トラックへ残します。

## 小さく実装する

最初からReact 19.2の全機能を再現しません。「文字列が出た」「コンポーネントになった」「stateで更新できた」という短い成功を積み重ねます。各段階のコードは`book/impls`、完成版は`packages`にあります。

```text
JSX → React Element → Fiber tree → DOM
                         ↑
                 state update queue
```

## Playground確認

`pnpm install`の後に`pnpm play`を実行すると、`examples/playground`のTodoアプリが起動します。最終章の姿を最初に触り、これから作るものを具体化してください。

## テスト

`pnpm test`はElement、DOM更新、key、Hooks、Effectを検証します。教材内の不完全な段階と完成版を混同しないよう、完成版のテストは常にgreenを維持します。

## 本家Reactとの対応

本家では`react`、`react-reconciler`、`react-dom`、`scheduler`などへ分かれています。本書もこの境界を縮小して採用します。ただし内部名やデータ構造の完全一致は目指しません。

次は、最も低い入口である`createRoot(...).render(...)`を作ります。
