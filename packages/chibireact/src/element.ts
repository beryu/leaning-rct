import {
  CHIBI_ELEMENT,
  Fragment,
  type ChibiReactElement,
  type ChibiReactNode,
  type ElementType,
  type Key,
} from "./types";

function flattenChildren(children: ChibiReactNode[]): ChibiReactNode[] {
  const normalized: ChibiReactNode[] = [];
  for (const child of children) {
    if (Array.isArray(child)) normalized.push(...flattenChildren(child));
    else if (child !== true && child !== false) normalized.push(child);
  }
  return normalized;
}

export function createElement<P extends Record<string, unknown>>(
  type: ElementType,
  config: (P & { key?: Key }) | null,
  ...children: ChibiReactNode[]
): ChibiReactElement<P> {
  const props = { ...(config ?? {}) } as P & {
    children?: ChibiReactNode;
    key?: Key;
  };
  const key = props.key == null ? null : String(props.key);
  delete props.key;

  const normalized = flattenChildren(children);
  if (normalized.length === 1) props.children = normalized[0];
  if (normalized.length > 1) props.children = normalized;

  return { $$typeof: CHIBI_ELEMENT, type, key, props };
}

export function jsx(
  type: ElementType,
  config: Record<string, unknown> & { key?: Key },
  maybeKey?: Key,
): ChibiReactElement {
  const { key: configKey, ...props } = config;
  return {
    $$typeof: CHIBI_ELEMENT,
    type,
    key: maybeKey ?? configKey ?? null,
    props,
  } as ChibiReactElement;
}

export { Fragment };
