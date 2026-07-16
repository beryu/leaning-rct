const queue = new Set<() => void>();
let pending = false;

export function scheduleMicrotask(task: () => void): void {
  queue.add(task);
  if (pending) return;
  pending = true;
  queueMicrotask(() => {
    try {
      for (const item of [...queue]) item();
    } finally {
      queue.clear();
      pending = false;
    }
  });
}
