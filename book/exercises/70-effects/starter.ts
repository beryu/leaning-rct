type Effect = { dependencies: readonly unknown[]; cleanup?: () => void };
let previous: Effect | undefined;
const events: string[] = [];
function commitEffect(
  dependencies: readonly unknown[],
  create: () => (() => void) | void,
) {
  const unchanged =
    previous?.dependencies.length === dependencies.length &&
    previous.dependencies.every((value, index) =>
      Object.is(value, dependencies[index]),
    );
  if (unchanged) return;
  previous?.cleanup?.();
  events.push("cleanup → create");
  previous = { dependencies, cleanup: create() };
}
let version = 0;
function render() {
  commitEffect([version], () => {
    events.push(`effect ${version}`);
    return () => events.push(`cleanup ${version}`);
  });
  document.querySelector("#log")!.textContent = events.join("\n");
}
document.querySelector("#app")!.innerHTML =
  `<h2>Effectのcommit順序</h2><button id="update">dependencyを変更</button><pre id="log"></pre>`;
document.querySelector("#update")!.addEventListener("click", () => {
  version += 1;
  render();
});
render();
