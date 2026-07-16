export type StateAction<S> = S | ((previous: S) => S);
export type StateHook<S> = { state: S; queue: StateAction<S>[] };

export function processStateQueue<S>(hook: StateHook<S>): S {
  for (const action of hook.queue.splice(0)) {
    hook.state =
      typeof action === "function"
        ? (action as (value: S) => S)(hook.state)
        : action;
  }
  return hook.state;
}
