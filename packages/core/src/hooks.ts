import { resolveDispatcher } from "./internal";
import type {
  DependencyList,
  Dispatch,
  EffectCallback,
  SetStateAction,
} from "./types";

export function useState<S>(
  initial: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] {
  return resolveDispatcher().useState(initial);
}

export function useEffect(
  effect: EffectCallback,
  dependencies?: DependencyList,
): void {
  resolveDispatcher().useEffect(effect, dependencies);
}
