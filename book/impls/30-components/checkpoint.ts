type NodeValue =
  string | { type: string | ((props: any) => NodeValue); props: any };

export function mount(value: NodeValue, parent: Element): void {
  if (typeof value === "string") {
    parent.append(document.createTextNode(value));
  } else if (typeof value.type === "function") {
    mount(value.type(value.props), parent);
  } else {
    const element = document.createElement(value.type);
    for (const child of ([] as NodeValue[]).concat(value.props.children ?? []))
      mount(child, element);
    parent.append(element);
  }
}
