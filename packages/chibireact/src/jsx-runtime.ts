export { Fragment, jsx, jsx as jsxDEV, jsx as jsxs } from "./element";
export type { ChibiReactElement as JSXElement } from "./types";

export namespace JSX {
  export type Element = import("./types").ChibiReactElement;
  export interface ElementChildrenAttribute {
    children: Record<string, never>;
  }
  export interface IntrinsicElements {
    div: HTMLAttributes<HTMLDivElement>;
    main: HTMLAttributes<HTMLElement>;
    section: HTMLAttributes<HTMLElement>;
    article: HTMLAttributes<HTMLElement>;
    header: HTMLAttributes<HTMLElement>;
    footer: HTMLAttributes<HTMLElement>;
    nav: HTMLAttributes<HTMLElement>;
    form: HTMLAttributes<HTMLFormElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    strong: HTMLAttributes<HTMLElement>;
    small: HTMLAttributes<HTMLElement>;
    ul: HTMLAttributes<HTMLUListElement>;
    ol: HTMLAttributes<HTMLOListElement>;
    li: HTMLAttributes<HTMLLIElement>;
    button: HTMLAttributes<HTMLButtonElement> & {
      disabled?: boolean;
      type?: "button" | "submit" | "reset";
    };
    input: HTMLAttributes<HTMLInputElement> & {
      value?: string | number;
      checked?: boolean;
      placeholder?: string;
      type?: string;
    };
    label: HTMLAttributes<HTMLLabelElement>;
    a: HTMLAttributes<HTMLAnchorElement> & {
      href?: string;
      target?: string;
      rel?: string;
    };
    code: HTMLAttributes<HTMLElement>;
    pre: HTMLAttributes<HTMLPreElement>;
  }
}

type CSSProperties = Partial<CSSStyleDeclaration> &
  Record<`--${string}`, string | number>;

interface HTMLAttributes<T extends Element> {
  key?: import("./types").Key;
  id?: string;
  className?: string;
  title?: string;
  role?: string;
  tabIndex?: number;
  children?: import("./types").ChibiReactNode;
  style?: CSSProperties;
  onClick?: (event: MouseEvent & { currentTarget: T }) => void;
  onInput?: (event: InputEvent & { currentTarget: T }) => void;
  onChange?: (event: Event & { currentTarget: T }) => void;
  onSubmit?: (event: SubmitEvent & { currentTarget: T }) => void;
  [attribute: `aria-${string}`]: string | number | boolean | undefined;
  [attribute: `data-${string}`]: string | number | boolean | undefined;
}
