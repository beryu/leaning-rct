export type Child = { key: string | number | null; type: unknown };

export function matchChildren(previous: Child[], next: Child[]) {
  const old = new Map(
    previous.map((child, index) => [child.key ?? index, child]),
  );
  return next.map((child, index) => {
    const identity = child.key ?? index;
    const candidate = old.get(identity);
    old.delete(identity);
    return {
      child,
      reusable: candidate?.type === child.type,
      previous: candidate ?? null,
    };
  });
}
