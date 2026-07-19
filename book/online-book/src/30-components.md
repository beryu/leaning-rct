<script setup>
import BrowserExercise from "../.vitepress/theme/components/BrowserExercise.vue";
import starter from "../../exercises/30-components/starter.ts?raw";
</script>

# 4. コンポーネント

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

Host Componentと関数コンポーネントを区別し、props、children、event、styleをDOMへ反映します。

## 前提知識

小文字の`div`はDOM要素、大文字の`Greeting`は関数としてJSX runtimeへ渡ります。

## typeから処理を選ぶ

```ts
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}</p>;
}
```

typeが文字列ならDOM Elementを生成します。関数ならpropsを渡して呼び出し、返されたElementをさらに処理します。FragmentならDOMを作らずchildrenへ進みます。

## DOM props

- `className`は`class`属性へ変換する。
- `style`は前回と次回を比較し、消えたpropertyも削除する。
- `onClick`などは古いlistenerを外してから新しいlistenerを登録する。
- `value`と`checked`はDOM propertyとして更新する。
- `aria-*`と`data-*`は属性として保持する。

## ブラウザで実装する

関数コンポーネントへpropsを渡し、返されたElementをmountして結果を表示してください。

<ClientOnly><BrowserExercise title="関数コンポーネントを呼び出す" storage-key="30-components" :initial-code="starter" /></ClientOnly>

## Playground確認

Todoアプリの入力、追加ボタン、リストはすべてこの処理を通ります。イベント関数を更新して、古いlistenerが二重に呼ばれないことを確認してください。

## テスト

属性の追加・変更・削除、styleの削除、イベント差し替え、Fragmentが余分なDOMを作らないことを検証します。

## 本家Reactとの対応

本家のReact DOMはフォーム、selection、namespace、hydrationなど多くのケースを扱います。本章では学習用Playgroundに必要な主要属性だけを明示的に型定義します。

章の実装: [`book/impls/30-components`](https://github.com/beryu/leaning-rct/tree/main/book/impls/30-components)
