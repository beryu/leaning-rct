import {
  RCT_ELEMENT,
  Fragment,
  type RctElement,
  type RctNode,
  type ElementType,
  type Key,
} from "./types";

function flattenChildren(children: RctNode[]): RctNode[] {
  const normalized: RctNode[] = [];
  for (const child of children) {
    if (Array.isArray(child)) normalized.push(...flattenChildren(child));
    else if (child !== true && child !== false) normalized.push(child);
  }
  return normalized;
}

export function createElement<P extends Record<string, unknown>>(
  type: ElementType,
  config: (P & { key?: Key }) | null,
  ...children: RctNode[]
): RctElement<P> {
  const props = { ...(config ?? {}) } as P & {
    children?: RctNode;
    key?: Key;
  };
  const key = props.key == null ? null : String(props.key);
  delete props.key;

  const normalized = flattenChildren(children);
  if (normalized.length === 1) props.children = normalized[0];
  if (normalized.length > 1) props.children = normalized;

  return { $$typeof: RCT_ELEMENT, type, key, props };
}

export function jsx(
  type: ElementType,
  config: Record<string, unknown> & { key?: Key },
  maybeKey?: Key,
): RctElement {
  const { key: configKey, ...props } = config;
  return {
    $$typeof: RCT_ELEMENT,
    type,
    key: maybeKey ?? configKey ?? null,
    props,
  } as RctElement;
}

export { Fragment };
