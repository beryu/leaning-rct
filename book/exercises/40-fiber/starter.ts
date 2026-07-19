type Fiber = {
  type: string;
  key: string | null;
  stateNode: Node | null;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
};
function createFiber(type: string, parent: Fiber | null): Fiber {
  return {
    type,
    key: null,
    stateNode: null,
    return: parent,
    child: null,
    sibling: null,
  };
}

const root = createFiber("root", null);
root.child = createFiber("main", root);
root.child.child = createFiber("h1", root.child);
root.child.child.sibling = createFiber("p", root.child);

function tree(fiber: Fiber | null, depth = 0): string[] {
  if (!fiber) return [];
  return [
    `${"  ".repeat(depth)}${fiber.type} (return: ${fiber.return?.type ?? "なし"})`,
    ...tree(fiber.child, depth + 1),
    ...tree(fiber.sibling, depth),
  ];
}
document.querySelector("#app")!.innerHTML =
  `<h2>最小Fiber tree</h2><pre>${tree(root).join("\n")}</pre>`;
console.log("child / sibling / return の関係", root);
