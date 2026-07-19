<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

const props = defineProps<{
  initialCode: string;
  storageKey: string;
  title?: string;
}>();

const code = ref(props.initialCode.trim());
const frame = ref<HTMLIFrameElement>();
const isReady = ref(false);
const isRunning = ref(false);
const saveState = ref<"saved" | "restored">("saved");

const localStorageKey = computed(
  () => `leaning-rct:exercise:v1:${props.storageKey}`,
);

onMounted(() => {
  const savedCode = window.localStorage.getItem(localStorageKey.value);
  if (savedCode !== null) {
    code.value = savedCode;
    saveState.value = "restored";
  }
  isReady.value = true;
});

watch(code, (value) => {
  if (!isReady.value) return;
  window.localStorage.setItem(localStorageKey.value, value);
  saveState.value = "saved";
});

function encodeSource(source: string) {
  const bytes = new TextEncoder().encode(source);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function createPreview(source: string) {
  const encodedSource = encodeSource(source);
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <style>
      :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
      body { margin: 0; padding: 20px; color: #16302d; background: #fbfdfc; }
      #app { min-height: 64px; }
      #console { margin: 20px -20px -20px; padding: 12px 20px; min-height: 24px; white-space: pre-wrap; color: #d4eee8; background: #102b28; font: 12px/1.6 ui-monospace, monospace; }
      #console:empty { display: none; }
      .error { color: #ffb4ab; }
      @media (prefers-color-scheme: dark) {
        body { color: #d4eee8; background: #14211f; }
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <pre id="console"></pre>
    <script>
      const output = document.querySelector("#console");
      const write = (kind, values) => {
        const line = document.createElement("div");
        line.className = kind;
        line.textContent = values.map((value) =>
          typeof value === "string" ? value : JSON.stringify(value, null, 2)
        ).join(" ");
        output.appendChild(line);
      };
      for (const method of ["log", "info", "warn", "error"]) {
        console[method] = (...values) => write(method === "error" ? "error" : "", values);
      }
      window.addEventListener("error", (event) => write("error", [event.message]));
      try {
        const bytes = Uint8Array.from(atob("${encodedSource}"), (character) => character.charCodeAt(0));
        const source = new TextDecoder().decode(bytes);
        Function(source)();
      } catch (error) {
        write("error", [error instanceof Error ? error.message : String(error)]);
      }
    <\/script>
  </body>
</html>`;
}

async function run() {
  isRunning.value = true;
  try {
    const ts = await import("typescript");
    const result = ts.transpileModule(code.value, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.None,
        jsx: ts.JsxEmit.React,
        jsxFactory: "createElement",
      },
      reportDiagnostics: true,
    });
    const errors = (result.diagnostics ?? []).filter(
      (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
    );
    const source = errors.length
      ? `throw new Error(${JSON.stringify(
          errors
            .map((diagnostic) =>
              ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
            )
            .join("\n"),
        )})`
      : result.outputText;

    await nextTick();
    if (frame.value) frame.value.srcdoc = createPreview(source);
  } finally {
    isRunning.value = false;
  }
}

function reset() {
  if (!window.confirm("この章で編集したコードを初期状態に戻しますか？")) return;
  window.localStorage.removeItem(localStorageKey.value);
  code.value = props.initialCode.trim();
  saveState.value = "saved";
  void run();
}
</script>

<template>
  <section class="browser-exercise" :aria-label="title ?? 'ブラウザ演習'">
    <header class="browser-exercise__header">
      <div>
        <strong>{{ title ?? "ブラウザ演習" }}</strong>
        <span class="browser-exercise__save-state">
          {{
            saveState === "restored"
              ? "前回のコードを復元しました"
              : "このブラウザに保存済み"
          }}
        </span>
      </div>
      <div class="browser-exercise__actions">
        <button
          class="browser-exercise__button browser-exercise__button--secondary"
          type="button"
          @click="reset"
        >
          リセット
        </button>
        <button
          class="browser-exercise__button"
          type="button"
          :disabled="isRunning"
          @click="run"
        >
          {{ isRunning ? "準備中…" : "実行" }}
        </button>
      </div>
    </header>

    <div class="browser-exercise__workspace">
      <label class="browser-exercise__pane">
        <span class="browser-exercise__label">コード</span>
        <textarea
          v-model="code"
          class="browser-exercise__editor"
          aria-label="編集するTypeScriptコード"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </label>
      <div class="browser-exercise__pane">
        <span class="browser-exercise__label">実行結果</span>
        <iframe
          ref="frame"
          class="browser-exercise__preview"
          title="コードの実行結果"
          sandbox="allow-scripts"
        />
      </div>
    </div>
    <p class="browser-exercise__notice">
      編集内容はこのブラウザのLocalStorageだけに保存され、GitHubや外部サーバーには送信されません。
    </p>
  </section>
</template>

<style scoped>
.browser-exercise {
  margin: 24px 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.browser-exercise__header,
.browser-exercise__actions,
.browser-exercise__header > div:first-child {
  display: flex;
  align-items: center;
}

.browser-exercise__header {
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.browser-exercise__header > div:first-child {
  flex-wrap: wrap;
  gap: 6px 12px;
}

.browser-exercise__save-state {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.browser-exercise__actions {
  gap: 8px;
}

.browser-exercise__button {
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 7px;
  padding: 6px 13px;
  color: var(--vp-button-brand-text);
  background: var(--vp-c-brand-1);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.browser-exercise__button--secondary {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.browser-exercise__button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.browser-exercise__workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr);
}

.browser-exercise__pane {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.browser-exercise__pane + .browser-exercise__pane {
  border-left: 1px solid var(--vp-c-divider);
}

.browser-exercise__label {
  padding: 7px 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  font-size: 12px;
  font-weight: 600;
}

.browser-exercise__editor,
.browser-exercise__preview {
  box-sizing: border-box;
  width: 100%;
  height: 280px;
  border: 0;
  border-radius: 0;
  background: var(--vp-c-bg);
}

.browser-exercise__editor {
  resize: vertical;
  padding: 16px;
  color: var(--vp-c-text-1);
  outline: none;
  font: 13px/1.65 var(--vp-font-family-mono);
  tab-size: 2;
}

.browser-exercise__editor:focus {
  box-shadow: inset 0 0 0 2px var(--vp-c-brand-1);
}

.browser-exercise__notice {
  margin: 0;
  padding: 9px 14px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

@media (max-width: 720px) {
  .browser-exercise__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .browser-exercise__workspace {
    grid-template-columns: 1fr;
  }

  .browser-exercise__pane + .browser-exercise__pane {
    border-top: 1px solid var(--vp-c-divider);
    border-left: 0;
  }

  .browser-exercise__editor,
  .browser-exercise__preview {
    height: 240px;
  }
}
</style>
