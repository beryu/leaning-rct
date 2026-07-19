function createRoot(container: Element) {
  return {
    render(_value: string) {
      // TODO: _valueをcontainerへ表示してください。
    },
    unmount() {
      container.textContent = "";
    },
  };
}

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render("Hello, leaning-rct!");
