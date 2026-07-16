export function createRoot(container: Element) {
  return {
    render(value: string) {
      container.textContent = value;
    },
    unmount() {
      container.textContent = "";
    },
  };
}
