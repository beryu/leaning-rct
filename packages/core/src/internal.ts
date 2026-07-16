import type {
  DependencyList,
  Dispatch,
  EffectCallback,
  SetStateAction,
} from "./types";

export interface Dispatcher {
  useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  useEffect(effect: EffectCallback, dependencies?: DependencyList): void;
}

let currentDispatcher: Dispatcher | null = null;

export function setCurrentDispatcher(dispatcher: Dispatcher | null): void {
  currentDispatcher = dispatcher;
}

export function resolveDispatcher(): Dispatcher {
  if (!currentDispatcher) {
    throw new Error(
      "Hooksは関数コンポーネントのレンダー中にだけ呼び出せます。",
    );
  }
  return currentDispatcher;
}
