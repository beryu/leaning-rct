type Todo = { id: number; title: string; done: boolean };
let todos: Todo[] = [
  { id: 1, title: "Elementを作る", done: true },
  { id: 2, title: "Fiberを観察する", done: false },
];
const app = document.querySelector("#app")!;
function render() {
  app.innerHTML = `<h2>小さなReact Todo</h2><form><label>新しいTodo <input aria-label="新しいTodo" /></label><button>追加する</button></form><ul>${todos.map((todo) => `<li><button type="button" data-id="${todo.id}">${todo.done ? "✓" : "○"} ${todo.title}</button></li>`).join("")}</ul><p>未完了: ${todos.filter((todo) => !todo.done).length}件</p>`;
  app.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = app.querySelector("input") as HTMLInputElement;
    if (input.value.trim())
      todos = [
        ...todos,
        { id: Date.now(), title: input.value.trim(), done: false },
      ];
    render();
  });
  app.querySelectorAll("[data-id]").forEach((button) =>
    button.addEventListener("click", () => {
      const id = Number((button as HTMLElement).dataset.id);
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      );
      render();
    }),
  );
}
render();
