export type Fiber = {
  type: unknown;
  key: string | number | null;
  stateNode: Node | null;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
};

export function createFiber(type: unknown, parent: Fiber | null): Fiber {
  return {
    type,
    key: null,
    stateNode: null,
    return: parent,
    child: null,
    sibling: null,
    alternate: null,
  };
}
