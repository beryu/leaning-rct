import {
  createReconcilerRoot,
  type HostConfig,
  type ReconcilerRoot,
} from "@chibireact/reconciler";
import type { ChibiReactNode } from "chibireact";

export interface Root {
  render(node: ChibiReactNode): void;
  unmount(): void;
}

const listeners = new WeakMap<Element, Map<string, EventListener>>();

const hostConfig: HostConfig = {
  createElement: (type) => document.createElement(type),
  createText: (value) => document.createTextNode(value),
  updateText(text, value) {
    if (text.data !== value) text.data = value;
  },
  updateElement(element, previous, next) {
    const names = new Set([...Object.keys(previous), ...Object.keys(next)]);
    names.delete("children");
    names.delete("key");
    for (const name of names) {
      const before = previous[name];
      const after = next[name];
      if (Object.is(before, after)) continue;
      setProperty(element as HTMLElement, name, before, after);
    }
  },
};

export function createRoot(container: Element | DocumentFragment): Root {
  if (!(
    container instanceof Element || container instanceof DocumentFragment
  )) {
    throw new TypeError(
      "createRootにはElementまたはDocumentFragmentを渡してください。",
    );
  }
  const root: ReconcilerRoot = createReconcilerRoot(container, hostConfig);
  return {
    render: (node) => root.render(node),
    unmount: () => root.unmount(),
  };
}

function setProperty(
  element: HTMLElement,
  name: string,
  previous: unknown,
  value: unknown,
): void {
  if (name === "className") {
    if (value == null) element.removeAttribute("class");
    else element.setAttribute("class", String(value));
    return;
  }
  if (name === "style") {
    updateStyle(
      element,
      (previous ?? {}) as Record<string, string | number>,
      (value ?? {}) as Record<string, string | number>,
    );
    return;
  }
  if (/^on[A-Z]/.test(name)) {
    updateEvent(element, name.slice(2).toLowerCase(), value);
    return;
  }
  if (name === "value" || name === "checked") {
    (element as any)[name] = value ?? (name === "checked" ? false : "");
    return;
  }
  if (value == null || value === false) {
    element.removeAttribute(name);
  } else if (value === true) {
    element.setAttribute(name, "");
  } else {
    element.setAttribute(name, String(value));
  }
}

function updateStyle(
  element: HTMLElement,
  previous: Record<string, string | number>,
  next: Record<string, string | number>,
): void {
  for (const name of Object.keys(previous)) {
    if (!(name in next)) element.style.removeProperty(toCssName(name));
  }
  for (const [name, value] of Object.entries(next)) {
    element.style.setProperty(toCssName(name), String(value));
  }
}

function toCssName(name: string): string {
  if (name.startsWith("--")) return name;
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function updateEvent(
  element: Element,
  eventName: string,
  value: unknown,
): void {
  let map = listeners.get(element);
  if (!map) {
    map = new Map();
    listeners.set(element, map);
  }
  const previous = map.get(eventName);
  if (previous) element.removeEventListener(eventName, previous);
  if (typeof value === "function") {
    const listener = value as EventListener;
    map.set(eventName, listener);
    element.addEventListener(eventName, listener);
  } else {
    map.delete(eventName);
  }
}
