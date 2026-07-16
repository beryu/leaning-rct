import { scheduleMicrotask } from "@leaning-rct/scheduler";
import {
  setCurrentDispatcher,
  type Dispatcher,
} from "@leaning-rct/core/internal";
import {
  Fragment,
  type RctElement,
  type RctNode,
  type DependencyList,
  type Dispatch,
  type EffectCallback,
  type FunctionComponent,
  type SetStateAction,
} from "@leaning-rct/core";

type FiberTag = "root" | "host" | "text" | "function" | "fragment";

interface StateHook<S = unknown> {
  kind: "state";
  state: S;
  queue: SetStateAction<S>[];
}

interface EffectHook {
  kind: "effect";
  create: EffectCallback;
  dependencies?: DependencyList;
  cleanup?: () => void;
}

type Hook = StateHook | EffectHook;

export interface Fiber {
  tag: FiberTag;
  type: RctElement["type"] | null;
  key: string | number | null;
  props: Record<string, unknown>;
  stateNode: Node | null;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  hooks: Hook[];
  index: number;
  root: FiberRoot;
}

export interface HostConfig {
  createElement(type: string): Element;
  createText(value: string): Text;
  updateElement(
    element: Element,
    previous: Record<string, unknown>,
    next: Record<string, unknown>,
  ): void;
  updateText(text: Text, value: string): void;
}

export interface FiberRoot {
  container: Element | DocumentFragment;
  current: Fiber;
  element: RctNode;
  scheduled: boolean;
  host: HostConfig;
  pendingEffects: EffectHook[];
}

export interface ReconcilerRoot {
  render(node: RctNode): void;
  unmount(): void;
  flushSync(): void;
}

function createFiberRoot(
  container: Element | DocumentFragment,
  host: HostConfig,
): FiberRoot {
  const root = {} as FiberRoot;
  const current: Fiber = {
    tag: "root",
    type: null,
    key: null,
    props: {},
    stateNode: container,
    return: null,
    child: null,
    sibling: null,
    alternate: null,
    hooks: [],
    index: 0,
    root,
  };
  Object.assign(root, {
    container,
    current,
    element: null,
    scheduled: false,
    host,
    pendingEffects: [],
  });
  return root;
}

export function createReconcilerRoot(
  container: Element | DocumentFragment,
  host: HostConfig,
): ReconcilerRoot {
  const root = createFiberRoot(container, host);
  return {
    render(node) {
      root.element = node;
      scheduleRoot(root);
    },
    unmount() {
      root.element = null;
      performWork(root);
    },
    flushSync() {
      performWork(root);
    },
  };
}

function scheduleRoot(root: FiberRoot): void {
  if (root.scheduled) return;
  root.scheduled = true;
  scheduleMicrotask(() => performWork(root));
}

function performWork(root: FiberRoot): void {
  root.scheduled = false;
  root.pendingEffects = [];
  const nextRoot: Fiber = {
    ...root.current,
    child: null,
    alternate: root.current,
    root,
  };
  nextRoot.child = reconcileChildren(
    nextRoot,
    root.container,
    root.current.child,
    normalizeChildren(root.element),
  );
  root.current = nextRoot;
  if (root.pendingEffects.length > 0) {
    const effects = [...root.pendingEffects];
    queueMicrotask(() => flushEffects(effects));
  }
}

function normalizeChildren(node: RctNode): RctNode[] {
  if (Array.isArray(node)) {
    const children: RctNode[] = [];
    for (const child of node) children.push(...normalizeChildren(child));
    return children;
  }
  if (node == null || typeof node === "boolean") return [];
  return [node];
}

function nodeIdentity(node: RctNode, index: number): string | number {
  if (isElement(node) && node.key != null) return node.key;
  return index;
}

function sameType(fiber: Fiber, node: RctNode): boolean {
  if (typeof node === "string" || typeof node === "number")
    return fiber.tag === "text";
  if (!isElement(node)) return false;
  return fiber.type === node.type;
}

function reconcileChildren(
  parent: Fiber,
  parentDom: Element | DocumentFragment,
  oldFirstChild: Fiber | null,
  newChildren: RctNode[],
): Fiber | null {
  const oldByIdentity = new Map<string | number, Fiber>();
  let old = oldFirstChild;
  while (old) {
    oldByIdentity.set(old.key ?? old.index, old);
    old = old.sibling;
  }

  let first: Fiber | null = null;
  let previous: Fiber | null = null;
  for (let index = 0; index < newChildren.length; index += 1) {
    const node = newChildren[index]!;
    const identity = nodeIdentity(node, index);
    const candidate = oldByIdentity.get(identity) ?? null;
    const matched = candidate && sameType(candidate, node) ? candidate : null;
    if (candidate) oldByIdentity.delete(identity);
    if (candidate && !matched) deleteFiber(candidate, parentDom);

    const fiber = reconcileFiber(parent, parentDom, matched, node, index);
    if (!fiber) continue;
    if (!first) first = fiber;
    if (previous) previous.sibling = fiber;
    previous = fiber;
  }

  for (const stale of oldByIdentity.values()) deleteFiber(stale, parentDom);
  if (previous) previous.sibling = null;

  let cursor: ChildNode | null = parentDom.firstChild;
  let fiber = first;
  while (fiber) {
    for (const node of topLevelHostNodes(fiber)) {
      if (node !== cursor) parentDom.insertBefore(node, cursor);
      cursor = node.nextSibling;
    }
    fiber = fiber.sibling;
  }
  return first;
}

function reconcileFiber(
  parent: Fiber,
  parentDom: Element | DocumentFragment,
  oldFiber: Fiber | null,
  node: RctNode,
  index: number,
): Fiber | null {
  if (typeof node === "string" || typeof node === "number") {
    const value = String(node);
    const text = oldFiber?.stateNode as Text | undefined;
    const stateNode = text ?? parent.root.host.createText(value);
    parent.root.host.updateText(stateNode, value);
    return makeFiber(
      parent,
      oldFiber,
      "text",
      null,
      null,
      {},
      stateNode,
      index,
    );
  }
  if (!isElement(node)) return null;

  if (node.type === Fragment) {
    const fiber = makeFiber(
      parent,
      oldFiber,
      "fragment",
      Fragment,
      node.key,
      node.props,
      null,
      index,
    );
    fiber.child = reconcileChildren(
      fiber,
      parentDom,
      oldFiber?.child ?? null,
      normalizeChildren(node.props.children),
    );
    return fiber;
  }

  if (typeof node.type === "function") {
    const fiber = makeFiber(
      parent,
      oldFiber,
      "function",
      node.type,
      node.key,
      node.props,
      null,
      index,
    );
    const rendered = renderFunctionComponent(fiber, node.type, node.props);
    fiber.child = reconcileChildren(
      fiber,
      parentDom,
      oldFiber?.child ?? null,
      normalizeChildren(rendered),
    );
    if (oldFiber && oldFiber.hooks.length !== fiber.hooks.length) {
      throw new Error("Hooksの数が前回のレンダーから変わりました。");
    }
    return fiber;
  }

  const element =
    (oldFiber?.stateNode as Element | null) ??
    parent.root.host.createElement(node.type);
  parent.root.host.updateElement(element, oldFiber?.props ?? {}, node.props);
  const fiber = makeFiber(
    parent,
    oldFiber,
    "host",
    node.type,
    node.key,
    node.props,
    element,
    index,
  );
  fiber.child = reconcileChildren(
    fiber,
    element,
    oldFiber?.child ?? null,
    normalizeChildren(node.props.children),
  );
  return fiber;
}

function makeFiber(
  parent: Fiber,
  alternate: Fiber | null,
  tag: FiberTag,
  type: Fiber["type"],
  key: Fiber["key"],
  props: Record<string, unknown>,
  stateNode: Node | null,
  index: number,
): Fiber {
  return {
    tag,
    type,
    key,
    props,
    stateNode,
    return: parent,
    child: null,
    sibling: null,
    alternate,
    hooks: [],
    index,
    root: parent.root,
  };
}

function renderFunctionComponent(
  fiber: Fiber,
  component: FunctionComponent<any>,
  props: Record<string, unknown>,
): RctNode {
  let hookIndex = 0;
  const oldHooks = fiber.alternate?.hooks ?? [];
  const dispatcher: Dispatcher = {
    useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
      const oldHook = oldHooks[hookIndex] as StateHook<S> | undefined;
      if (oldHook && oldHook.kind !== "state") throw hookOrderError();
      const queue = oldHook?.queue ?? [];
      let state = oldHook
        ? oldHook.state
        : typeof initial === "function"
          ? (initial as () => S)()
          : initial;
      for (const action of queue.splice(0)) {
        state =
          typeof action === "function"
            ? (action as (value: S) => S)(state)
            : action;
      }
      const hook: StateHook<S> = { kind: "state", state, queue };
      fiber.hooks.push(hook);
      hookIndex += 1;
      const dispatch: Dispatch<SetStateAction<S>> = (action) => {
        queue.push(action);
        scheduleRoot(fiber.root);
      };
      return [state, dispatch];
    },
    useEffect(create, dependencies) {
      const oldHook = oldHooks[hookIndex] as EffectHook | undefined;
      if (oldHook && oldHook.kind !== "effect") throw hookOrderError();
      const hook: EffectHook = {
        kind: "effect",
        create,
        dependencies,
        cleanup: oldHook?.cleanup,
      };
      fiber.hooks.push(hook);
      hookIndex += 1;
      if (
        !oldHook ||
        !areDependenciesEqual(oldHook.dependencies, dependencies)
      ) {
        fiber.root.pendingEffects.push(hook);
      }
    },
  };

  setCurrentDispatcher(dispatcher);
  try {
    return component(props);
  } finally {
    setCurrentDispatcher(null);
  }
}

function hookOrderError(): Error {
  return new Error("Hooksの呼び出し順が前回のレンダーから変わりました。");
}

function areDependenciesEqual(
  previous?: DependencyList,
  next?: DependencyList,
): boolean {
  if (!previous || !next || previous.length !== next.length) return false;
  return previous.every((value, index) => Object.is(value, next[index]));
}

function flushEffects(effects: EffectHook[]): void {
  for (const hook of effects) {
    hook.cleanup?.();
    const cleanup = hook.create();
    hook.cleanup = typeof cleanup === "function" ? cleanup : undefined;
  }
}

function topLevelHostNodes(fiber: Fiber): Node[] {
  if (fiber.tag === "host" || fiber.tag === "text") {
    return fiber.stateNode ? [fiber.stateNode] : [];
  }
  const nodes: Node[] = [];
  let child = fiber.child;
  while (child) {
    nodes.push(...topLevelHostNodes(child));
    child = child.sibling;
  }
  return nodes;
}

function deleteFiber(
  fiber: Fiber,
  parentDom: Element | DocumentFragment,
): void {
  cleanupFiber(fiber);
  for (const node of topLevelHostNodes(fiber)) {
    if (node.parentNode === parentDom) parentDom.removeChild(node);
  }
}

function cleanupFiber(fiber: Fiber): void {
  for (const hook of fiber.hooks) {
    if (hook.kind === "effect") hook.cleanup?.();
  }
  let child = fiber.child;
  while (child) {
    cleanupFiber(child);
    child = child.sibling;
  }
}

function isElement(node: RctNode): node is RctElement {
  return (
    typeof node === "object" &&
    node !== null &&
    !Array.isArray(node) &&
    "$$typeof" in node
  );
}
