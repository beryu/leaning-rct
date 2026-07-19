type Action<S> = S | ((previous: S) => S);
function useState<S>(initial: S) {
  let state = initial;
  const queue: Action<S>[] = [];
  return [
    () => {
      for (const action of queue.splice(0))
        state =
          typeof action === "function"
            ? (action as (value: S) => S)(state)
            : action;
      return state;
    },
    (action: Action<S>) => queue.push(action),
  ] as const;
}

const [readCount, setCount] = useState(0);
setCount((count) => count + 1);
setCount((count) => count + 1);
const count = readCount();
document.querySelector("#app")!.innerHTML =
  `<h2>Hooksの更新キュー</h2><p>同じイベント内で2回更新 → <strong>${count}</strong></p><button id="add">さらに1回更新</button>`;
document.querySelector("#add")!.addEventListener("click", () => {
  setCount((value) => value + 1);
  document.querySelector("strong")!.textContent = String(readCount());
});
console.log("queueを呼び出し順に処理しました");
