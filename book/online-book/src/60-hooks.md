# 7. 最小Hooks

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

関数コンポーネントのFiberへHookを順番に保存し、`useState`と更新キューを実装します。

## 前提知識

関数はレンダーごとに最初から実行されます。ローカル変数だけではstateを次のレンダーへ持ち越せません。

## Hookの保存場所

レンダー中のFiberとHook indexをdispatcherが管理します。`useState`が呼ばれるたび、前回Fiberの同じindexにあるHookを取得します。

```ts
type StateHook<S> = {
  state: S;
  queue: SetStateAction<S>[];
};
```

dispatchはqueueへvalueまたは更新関数を追加し、rootをscheduleします。次のレンダーでqueueを先頭から適用します。

## microtask batching

同じclick handler内でdispatchを二回呼んでも、rootは一つのmicrotaskだけを予約します。更新関数を使えば、二つの更新は直前の結果を順に受け取れます。

```ts
setCount((count) => count + 1);
setCount((count) => count + 1);
```

## Hooksを条件分岐できない理由

Hookを名前ではなく呼び出し順で対応付けるためです。前回とHookの種類・個数が変わった場合、leaning-rctは説明的な例外を投げます。

## Playground確認

Todoの追加と完了切り替えは配列stateの更新です。二つのstate更新が一度のrenderへまとまることをrender countで確認できます。

## テスト

初期値関数、値更新、関数更新、複数更新の順序、microtask batching、Hook順序違反を検証します。

## 本家Reactとの対応

本家もFiberにHooksとupdate queueを結び付けます。priority、lanes、render phase updateは本書の初回実装から除外しています。

章の実装: [`book/impls/60-hooks`](https://github.com/beryu/leaning-rct/tree/main/book/impls/60-hooks)
