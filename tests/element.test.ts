import { Fragment, createElement } from "@leaning-rct/core";
import { jsx, jsxs } from "@leaning-rct/core/jsx-runtime";

describe("React Element", () => {
  it("props、key、childrenを正規化する", () => {
    const element = createElement(
      "div",
      { id: "app", key: 7 },
      "hello",
      false,
      [" world"],
    );
    expect(element.type).toBe("div");
    expect(element.key).toBe("7");
    expect(element.props).toEqual({ id: "app", children: ["hello", " world"] });
  });

  it("automatic JSX runtimeとFragmentを公開する", () => {
    expect(jsx("span", { children: "one" }).props.children).toBe("one");
    expect(jsxs(Fragment, { children: ["one", "two"] }).type).toBe(Fragment);
  });
});
