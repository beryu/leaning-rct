import { Fragment, useEffect, useState } from "chibireact";
import { createRoot } from "chibireact-dom/client";

const tick = async (count = 1) => {
  for (let index = 0; index < count; index += 1) await Promise.resolve();
};

describe("DOM renderer", () => {
  it("関数コンポーネント、属性、style、イベントを描画・更新する", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const calls: string[] = [];
    root.render(
      <button
        className="before"
        style={{ color: "red" }}
        onClick={() => calls.push("before")}
      >
        click
      </button>,
    );
    await tick();
    const button = container.querySelector("button")!;
    button.click();
    expect(button.className).toBe("before");
    expect(button.style.color).toBe("red");

    root.render(
      <button
        className="after"
        style={{ backgroundColor: "blue" }}
        onClick={() => calls.push("after")}
      >
        updated
      </button>,
    );
    await tick();
    button.click();
    expect(container.textContent).toBe("updated");
    expect(button.className).toBe("after");
    expect(button.style.color).toBe("");
    expect(button.style.backgroundColor).toBe("blue");
    expect(calls).toEqual(["before", "after"]);
  });

  it("keyを使ってDOM nodeを並べ替える", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const list = (items: number[]) => (
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
    root.render(list([1, 2, 3]));
    await tick();
    const originalTwo = container.querySelectorAll("li")[1];
    root.render(list([3, 2, 4]));
    await tick();
    expect(
      [...container.querySelectorAll("li")].map((item) => item.textContent),
    ).toEqual(["3", "2", "4"]);
    expect(container.querySelectorAll("li")[1]).toBe(originalTwo);
  });

  it("useState更新を同じmicrotaskへまとめる", async () => {
    const container = document.createElement("div");
    let renderCount = 0;
    function Counter() {
      const [count, setCount] = useState(0);
      renderCount += 1;
      return (
        <button
          onClick={() => {
            setCount((value) => value + 1);
            setCount((value) => value + 1);
          }}
        >
          {count}
        </button>
      );
    }
    createRoot(container).render(<Counter />);
    await tick();
    container.querySelector("button")!.click();
    await tick();
    expect(container.textContent).toBe("2");
    expect(renderCount).toBe(2);
  });

  it("useEffectの依存比較とcleanupを行う", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const lifecycle: string[] = [];
    function Example({ value }: { value: number }) {
      useEffect(() => {
        lifecycle.push(`start:${value}`);
        return () => lifecycle.push(`stop:${value}`);
      }, [value]);
      return (
        <Fragment>
          <span>{value}</span>
        </Fragment>
      );
    }
    root.render(<Example value={1} />);
    await tick(2);
    root.render(<Example value={1} />);
    await tick(2);
    root.render(<Example value={2} />);
    await tick(2);
    root.unmount();
    expect(lifecycle).toEqual(["start:1", "stop:1", "start:2", "stop:2"]);
    expect(container.childNodes).toHaveLength(0);
  });
});
