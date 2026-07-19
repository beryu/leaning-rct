type NodeValue =
  | string
  | {
      type: string | ((props: Record<string, unknown>) => NodeValue);
      props: Record<string, unknown>;
    };

function Greeting(props: Record<string, unknown>): NodeValue {
  return {
    type: "p",
    props: { children: `こんにちは、${String(props.name)}さん！` },
  };
}

function mount(value: NodeValue, parent: Element) {
  if (typeof value === "string") parent.append(document.createTextNode(value));
  else if (typeof value.type === "function")
    mount(value.type(value.props), parent);
  else {
    const element = document.createElement(value.type);
    mount(String(value.props.children), element);
    parent.append(element);
  }
}

mount(
  { type: Greeting, props: { name: "コンポーネント" } },
  document.querySelector("#app")!,
);
console.log("関数コンポーネントがElementを返しました");
