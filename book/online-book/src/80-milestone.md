# 9. Todoマイルストーン

<span class="status-complete">✓ COMPLETE</span>

## 今回の到達点

ここまで実装したJSX、Component、Fiber、Reconciliation、Hooks、Effectを組み合わせ、Todoアプリを完成させます。

## 前提知識

前章までの完成版を使います。新しい内部機能は追加せず、各機能が一つの更新でどう連携するかに注目します。

## アプリを組み立てる

```tsx
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    document.title = `残り${todos.filter((todo) => !todo.done).length}件`;
  }, [todos]);

  return (
    <main>
      <input
        value={title}
        onInput={(event) => setTitle(event.currentTarget.value)}
      />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

## 一回の追加で起きること

1. input eventがstate updateをqueueへ積む。
2. schedulerがrootをmicrotaskへ一度だけ登録する。
3. 関数コンポーネントが再実行され、次のElement treeを返す。
4. reconcilerがcurrent Fiberと比較する。
5. rendererが必要なDOMだけを更新する。
6. commit後にdependenciesが変わったEffectを実行する。

## Playground確認

`pnpm play`でTodoの追加・完了切り替えを試します。このアプリはnpmのReactやReact DOMを依存関係に持ちません。

## テスト

Playwrightで入力、追加、key付きリスト、完了切り替えを実ブラウザ確認します。単体テストでは各責務を分離して検証します。

## 本家Reactとの対応

| leaning-rct           | Reactで対応する主な領域                     |
| --------------------- | ------------------------------------------- |
| `packages/core`       | `packages/react`                            |
| `packages/reconciler` | `packages/react-reconciler`                 |
| `packages/dom`        | `packages/react-dom-bindings` / `react-dom` |
| `packages/scheduler`  | `packages/scheduler`                        |

完全な互換実装ではありません。ここから本家ソースを読む際の地図として利用してください。

完成版: [`packages`](https://github.com/beryu/leaning-rct/tree/main/packages) · [Playground](https://github.com/beryu/leaning-rct/tree/main/examples/playground)
