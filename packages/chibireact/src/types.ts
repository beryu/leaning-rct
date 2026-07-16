export const CHIBI_ELEMENT = Symbol.for("chibireact.element");
export const Fragment = Symbol.for("chibireact.fragment");

export type Key = string | number | null;
export type ChibiReactText = string | number;
export type ChibiReactNode =
  | ChibiReactElement
  | ChibiReactText
  | boolean
  | null
  | undefined
  | ChibiReactNode[];

export type FunctionComponent<P = Record<string, unknown>> = (
  props: P & { children?: ChibiReactNode },
) => ChibiReactNode;

export type ElementType = string | FunctionComponent<any> | typeof Fragment;

export interface ChibiReactElement<P = Record<string, unknown>> {
  readonly $$typeof: typeof CHIBI_ELEMENT;
  readonly type: ElementType;
  readonly key: Key;
  readonly props: P & { children?: ChibiReactNode };
}

export type SetStateAction<S> = S | ((previous: S) => S);
export type Dispatch<A> = (value: A) => void;
export type EffectCleanup = void | (() => void);
export type EffectCallback = () => EffectCleanup;
export type DependencyList = readonly unknown[];
