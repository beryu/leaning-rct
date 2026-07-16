# ロードマップ

<span class="status-wip">WIP · 設計済み / 未実装</span>

ここから先は初回リリースに含まれない発展トラックです。未完成APIは`packages`からexportせず、本文・テスト・章別実装が揃った時点で順に公開します。

## Fiber詳細

flagsを使ったcommit、refs、portals、memo、context、class componentsを扱います。現在の再帰reconcilerをwork loopへ分割する段階です。

## Hooks詳細

`useReducer`、`useRef`、`useMemo`、`useCallback`、layout effectを追加し、Hookごとのライフサイクル差を比較します。

## SchedulerとConcurrent Rendering

priority、lanes、time slicing、automatic batching、transitionを扱います。同期版と比較できるよう、既存schedulerを置き換える形で進めます。

## SuspenseとError Boundary

レンダー中のPromiseとErrorを親境界へ伝え、fallbackとretryを実装します。

## SSRとHydration

`renderToString`、`hydrateRoot`、streamingを順に実装します。完成するまで`chibireact-dom/server`は公開しません。

## Custom Renderer

DOM固有処理をHost Configへ閉じ込め、同じreconcilerで別の描画先を扱います。React Nativeの理解につながる章です。

## React Compiler / Server Components

安定した公開APIと実験的な内部仕様を区別できる状態になってから着手します。特定のcanary実装を一般的なReactの仕様として説明しません。
