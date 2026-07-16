# 8. Effect

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

DOM commit後に外部システムと同期する`useEffect`を実装し、dependenciesとcleanupを扱います。

## 前提知識

Effectは表示内容の計算ではありません。document title、timer、通信、外部event listenerなど、Reactの外側との同期に使います。

## Effect Hook

```ts
type EffectHook = {
  create: () => void | (() => void);
  dependencies?: readonly unknown[];
  cleanup?: () => void;
};
```

レンダー時には実行せず、前回と次回のdependenciesを`Object.is`で比較します。変更があったEffectだけをrootのpending listへ積み、DOM commit後のmicrotaskで実行します。

## cleanupの順序

依存値が変わった場合は古いcleanupを呼んでから新しいEffectを開始します。subtreeの削除やrootのunmount時にもcleanupを呼びます。

```ts
useEffect(() => {
  document.title = `${todos.length} todos`;
  return () => {
    document.title = "chibireact";
  };
}, [todos]);
```

## Playground確認

Todo件数を変えるとdocument titleが更新されます。同じ配列参照のまま再renderした場合、Effectは再実行されません。

## テスト

初回実行、依存値不変、依存値変更時のcleanup、unmount cleanup、EffectがDOM更新後に実行されることを検証します。

## 本家Reactとの対応

本家はpassive effectを専用phaseで処理し、Strict Modeの開発時検査も行います。chibireactはmicrotaskで一度実行する最小モデルです。

章の実装: [`book/impls/70-effects`](https://github.com/beryu/chibireact/tree/main/book/impls/70-effects)
