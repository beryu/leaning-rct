const ELEMENT = Symbol.for("leaning-rct.element");

function createElement(
  type: string,
  props: Record<string, unknown> = {},
  ...children: unknown[]
) {
  return { $$typeof: ELEMENT, type, props: { ...props, children } };
}

const heading = createElement("h2", { className: "demo" }, "JSXの正体");
const message = document.createElement("p");
message.textContent = `${heading.type} / children: ${String(heading.props.children)}`;
document.querySelector("#app")?.append(
  heading.type === "h2"
    ? Object.assign(document.createElement("h2"), {
        textContent: heading.props.children,
      })
    : message,
  message,
);
console.log("Element", heading);
