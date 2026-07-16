export const RCT_ELEMENT = Symbol.for("leaning-rct.element");
export const Fragment = Symbol.for("leaning-rct.fragment");

export type Key = string | number | null;
export type RctText = string | number;
export type RctNode =
  RctElement | RctText | boolean | null | undefined | RctNode[];

export type FunctionComponent<P = Record<string, unknown>> = (
  props: P & { children?: RctNode },
) => RctNode;

export type ElementType = string | FunctionComponent<any> | typeof Fragment;

export interface RctElement<P = Record<string, unknown>> {
  readonly $$typeof: typeof RCT_ELEMENT;
  readonly type: ElementType;
  readonly key: Key;
  readonly props: P & { children?: RctNode };
}

export type SetStateAction<S> = S | ((previous: S) => S);
export type Dispatch<A> = (value: A) => void;
export type EffectCleanup = void | (() => void);
export type EffectCallback = () => EffectCleanup;
export type DependencyList = readonly unknown[];
