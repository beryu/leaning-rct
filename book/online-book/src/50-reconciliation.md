# 6. Reconciliation

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

前回と次回のchildrenを比較し、DOMの再利用、追加、削除、key付き並べ替えを実装します。

## 前提知識

DOMを毎回作り直すと入力フォーカスやselectionを失います。UI上で同じものと判断できるnodeは再利用します。

## 同一性を決める

各兄弟のidentityを`key ?? index`で決め、前回のFiberをMapに保持します。identityとtypeが一致すれば`alternate`として再利用し、一致しなければ古いsubtreeを削除します。

```ts
const identity = element.key ?? index;
const oldFiber = oldByIdentity.get(identity);
const reusable = oldFiber?.type === element.type;
```

新しいFiber順にHost nodeを`insertBefore`で並べると、既存nodeの移動と新規nodeの挿入を同じ処理で扱えます。

## keyの意味

keyは配列全体で永続的に一意である必要はなく、同じ親を持つ兄弟の間で安定していれば十分です。indexをkey代わりにすると、先頭挿入時に別項目のstateを引き継ぐ可能性があります。

## Playground確認

Todoを追加・完了しても、変更されていない`li`のDOM nodeは同じ参照のままです。テストでは並びを`[1,2,3]`から`[3,2,4]`へ変え、`2`のnodeが再利用されることを確認します。

## テスト

- 同一type・keyのnodeを再利用する。
- type変更時は古いsubtreeを削除する。
- 追加、削除、逆順、Fragment越しの並べ替えを処理する。

## 本家Reactとの対応

本家の`ChildReconciler`はplacementやdeletionをflagsとして記録し、commit時に適用します。本書はMapとDOM移動へ簡略化し、keyとtypeが同一性を決める中心概念を残します。

章の実装: [`book/impls/50-reconciliation`](https://github.com/beryu/leaning-rct/tree/main/book/impls/50-reconciliation)
