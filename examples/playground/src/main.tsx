import { useEffect, useState } from "chibireact";
import { createRoot } from "chibireact-dom/client";
import "./style.css";

type Todo = { id: number; title: string; done: boolean };

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "React Elementを作る", done: true },
    { id: 2, title: "Fiber treeを観察する", done: false },
  ]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    document.title = `残り${todos.filter((todo) => !todo.done).length}件 · chibireact`;
    return () => {
      document.title = "chibireact Playground";
    };
  }, [todos]);

  const addTodo = (event: SubmitEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((current) => [
      ...current,
      { id: Date.now(), title: trimmed, done: false },
    ]);
    setTitle("");
  };

  return (
    <main className="shell">
      <section className="card" aria-labelledby="playground-title">
        <p className="eyebrow">LIVE MILESTONE</p>
        <h1 id="playground-title">小さなReactで、Todoを動かす。</h1>
        <p className="lead">
          この画面はReact本体ではなく、教材で実装するchibireactだけで描画されています。
        </p>
        <form onSubmit={addTodo} className="composer">
          <label>
            新しいTodo
            <input
              value={title}
              onInput={(event) => setTitle(event.currentTarget.value)}
              placeholder="次に理解したいこと"
            />
          </label>
          <button type="submit">追加する</button>
        </form>
        <ul className="todos">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.done ? "done" : ""}>
              <button
                type="button"
                aria-label={`${todo.title}を${todo.done ? "未完了" : "完了"}にする`}
                onClick={() =>
                  setTodos((current) =>
                    current.map((item) =>
                      item.id === todo.id
                        ? { ...item, done: !item.done }
                        : item,
                    ),
                  )
                }
              >
                <span aria-hidden="true">{todo.done ? "✓" : "○"}</span>
                {todo.title}
              </button>
            </li>
          ))}
        </ul>
        <footer>
          <strong>{todos.filter((todo) => !todo.done).length}</strong>{" "}
          件のFiberが更新待ち
        </footer>
      </section>
    </main>
  );
}

const container = document.querySelector("#app");
if (!container) throw new Error("#appが見つかりません。");
createRoot(container).render(<TodoApp />);
