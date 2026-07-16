const ELEMENT = Symbol.for("leaning-rct.element");
export const Fragment = Symbol.for("leaning-rct.fragment");

export function jsx(
  type: unknown,
  { key = null, ...props }: Record<string, unknown>,
) {
  return { $$typeof: ELEMENT, type, key, props };
}

export const jsxs = jsx;
