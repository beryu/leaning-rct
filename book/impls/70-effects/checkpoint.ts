export type Effect = {
  dependencies?: readonly unknown[];
  cleanup?: () => void;
};

export function commitEffect(
  previous: Effect | undefined,
  nextDependencies: readonly unknown[] | undefined,
  create: () => void | (() => void),
): Effect {
  const unchanged =
    previous?.dependencies &&
    nextDependencies &&
    previous.dependencies.length === nextDependencies.length &&
    previous.dependencies.every((value, index) =>
      Object.is(value, nextDependencies[index]),
    );
  if (unchanged) return previous;
  previous?.cleanup?.();
  const cleanup = create();
  return {
    dependencies: nextDependencies,
    cleanup: typeof cleanup === "function" ? cleanup : undefined,
  };
}
