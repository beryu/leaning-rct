const ELEMENT = Symbol.for("chibireact.element");
export const Fragment = Symbol.for("chibireact.fragment");

export function jsx(
  type: unknown,
  { key = null, ...props }: Record<string, unknown>,
) {
  return { $$typeof: ELEMENT, type, key, props };
}

export const jsxs = jsx;
