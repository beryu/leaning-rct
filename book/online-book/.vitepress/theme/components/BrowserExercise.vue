<script setup lang="ts">
import * as typescript from "typescript";
import { computed, nextTick, onMounted, ref, watch } from "vue";

const props = defineProps<{
  initialCode: string;
  storageKey: string;
  title?: string;
}>();

type SaveState = "saved" | "restored" | "unavailable";

const code = ref(props.initialCode.trimEnd());
const frame = ref<HTMLIFrameElement>();
const isReady = ref(false);
const isRunning = ref(false);
const saveState = ref<SaveState>("saved");
const editor = ref<HTMLTextAreaElement>();
const highlight = ref<HTMLElement>();
const localStorageKey = computed(
  () => `leaning-rct:exercise:v1:${props.storageKey}`,
);

function storage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function readSavedCode() {
  try {
    return storage()?.getItem(localStorageKey.value) ?? null;
  } catch {
    saveState.value = "unavailable";
    return null;
  }
}

function saveCode(value: string) {
  try {
    storage()?.setItem(localStorageKey.value, value);
    if (storage()) saveState.value = "saved";
    else saveState.value = "unavailable";
  } catch {
    saveState.value = "unavailable";
  }
}

function tokenClass(
  ts: typeof import("typescript"),
  token: import("typescript").SyntaxKind,
) {
  if (token >= ts.SyntaxKind.FirstKeyword && token <= ts.SyntaxKind.LastKeyword)
    return "tok-keyword";

  switch (token) {
    case ts.SyntaxKind.SingleLineCommentTrivia:
    case ts.SyntaxKind.MultiLineCommentTrivia:
      return "tok-comment";
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
    case ts.SyntaxKind.TemplateHead:
    case ts.SyntaxKind.TemplateMiddle:
    case ts.SyntaxKind.TemplateTail:
      return "tok-string";
    case ts.SyntaxKind.NumericLiteral:
    case ts.SyntaxKind.BigIntLiteral:
      return "tok-number";
    default:
      return undefined;
  }
}

function highlighted(value: string) {
  const scanner = typescript.createScanner(
    typescript.ScriptTarget.Latest,
    false,
    typescript.LanguageVariant.JSX,
    value,
  );
  const tokens: { className?: string; text: string }[] = [];
  for (
    let token = scanner.scan();
    token !== typescript.SyntaxKind.EndOfFileToken;
    token = scanner.scan()
  ) {
    const text = scanner.getTokenText();
    const className = tokenClass(typescript, token);
    tokens.push({ className, text });
  }
  return tokens;
}

function syncEditor() {
  if (!editor.value || !highlight.value) return;
  const content = document.createDocumentFragment();
  for (const token of highlighted(code.value)) {
    if (!token.className) {
      content.append(token.text);
      continue;
    }
    const span = document.createElement("span");
    span.className = token.className;
    span.textContent = token.text;
    content.append(span);
  }
  content.append("\n");
  highlight.value.replaceChildren(content);
  highlight.value.scrollTop = editor.value.scrollTop;
  highlight.value.scrollLeft = editor.value.scrollLeft;
}

onMounted(() => {
  const savedCode = readSavedCode();
  if (savedCode !== null) {
    code.value = savedCode;
    saveState.value = "restored";
  }
  isReady.value = true;
  void nextTick(syncEditor);
});

watch(code, (value) => {
  if (isReady.value) saveCode(value);
  void nextTick(syncEditor);
});

function encodeSource(source: string) {
  const bytes = new TextEncoder().encode(source);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
}

function createPreview(source: string) {
  const encodedSource = encodeSource(source);
  return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><style>
  :root{color-scheme:light dark;font-family:ui-sans-serif,system-ui,sans-serif}body{margin:0;padding:20px;color:#16302d;background:#fbfdfc}#app{min-height:64px}#console{margin:20px -20px -20px;padding:12px 20px;min-height:24px;white-space:pre-wrap;color:#d4eee8;background:#102b28;font:12px/1.6 ui-monospace,monospace}#console:empty{display:none}.error{color:#ffb4ab}@media(prefers-color-scheme:dark){body{color:#d4eee8;background:#14211f}}
  </style></head><body><div id="app"></div><pre id="console"></pre><script>
  const output=document.querySelector('#console');const write=(kind,values)=>{const line=document.createElement('div');line.className=kind;line.textContent=values.map(value=>typeof value==='string'?value:JSON.stringify(value,null,2)).join(' ');output.append(line)};
  for(const method of ['log','info','warn','error']) console[method]=(...values)=>write(method==='error'?'error':method,values);
  window.addEventListener('error',event=>write('error',[event.message]));window.addEventListener('unhandledrejection',event=>write('error',[String(event.reason)]));
  try{const bytes=Uint8Array.from(atob('${encodedSource}'),character=>character.charCodeAt(0));const source=new TextDecoder().decode(bytes);Function(source)()}catch(error){write('error',[error instanceof Error?error.message:String(error)])}
  <\/script></body></html>`;
}

async function run() {
  isRunning.value = true;
  try {
    const result = typescript.transpileModule(code.value, {
      compilerOptions: {
        target: typescript.ScriptTarget.ES2022,
        module: typescript.ModuleKind.None,
        jsx: typescript.JsxEmit.React,
        jsxFactory: "createElement",
        jsxFragmentFactory: "Fragment",
      },
      reportDiagnostics: true,
    });
    const errors = (result.diagnostics ?? []).filter(
      (diagnostic) =>
        diagnostic.category === typescript.DiagnosticCategory.Error,
    );
    const source = errors.length
      ? `throw new Error(${JSON.stringify(
          errors
            .map((diagnostic) => {
              const line = diagnostic.file?.getLineAndCharacterOfPosition(
                diagnostic.start ?? 0,
              ).line;
              return `行${(line ?? 0) + 1}: ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\\n")}`;
            })
            .join("\\n"),
        )})`
      : result.outputText;
    await nextTick();
    if (frame.value) frame.value.srcdoc = createPreview(source);
  } catch (error) {
    await nextTick();
    if (frame.value)
      frame.value.srcdoc = createPreview(
        `throw new Error(${JSON.stringify(error instanceof Error ? error.message : String(error))})`,
      );
  } finally {
    isRunning.value = false;
  }
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    void run();
    return;
  }
  if (event.key !== "Tab") return;
  event.preventDefault();
  const target = event.currentTarget as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  code.value = `${code.value.slice(0, start)}  ${code.value.slice(end)}`;
  void nextTick(() => target.setSelectionRange(start + 2, start + 2));
}

function reset() {
  if (!window.confirm("この章で編集したコードを初期状態に戻しますか？")) return;
  try {
    storage()?.removeItem(localStorageKey.value);
  } catch {
    saveState.value = "unavailable";
  }
  code.value = props.initialCode.trimEnd();
  if (saveState.value !== "unavailable") saveState.value = "saved";
  void run();
}
</script>

<template>
  <section class="browser-exercise" :aria-label="title ?? 'ブラウザ演習'">
    <header class="browser-exercise__header">
      <div class="browser-exercise__heading">
        <strong>{{ title ?? "ブラウザ演習" }}</strong
        ><span class="browser-exercise__save-state" role="status">{{
          saveState === "restored"
            ? "前回のコードを復元しました"
            : saveState === "unavailable"
              ? "このブラウザでは保存できません"
              : "このブラウザに保存済み"
        }}</span>
      </div>
      <div class="browser-exercise__actions">
        <button
          class="browser-exercise__button browser-exercise__button--secondary"
          type="button"
          aria-label="この章のコードをリセット"
          @click="reset"
        >
          リセット</button
        ><button
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
      <label class="browser-exercise__pane"
        ><span class="browser-exercise__label">コード（TypeScript / TSX）</span>
        <div class="browser-exercise__editor-wrap">
          <pre
            ref="highlight"
            class="browser-exercise__highlight"
            aria-hidden="true"
          ></pre>
          <span class="browser-exercise__lines" aria-hidden="true"
            ><span v-for="line in code.split('\n').length" :key="line">{{
              line
            }}</span></span
          ><textarea
            ref="editor"
            v-model="code"
            class="browser-exercise__editor"
            aria-label="編集するTypeScriptコード"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            @keydown="onKeydown"
            @scroll="syncEditor"
          /></div
      ></label>
      <div class="browser-exercise__pane">
        <span class="browser-exercise__label">実行結果</span
        ><iframe
          ref="frame"
          class="browser-exercise__preview"
          title="コードの実行結果"
          sandbox="allow-scripts"
        />
      </div>
    </div>
    <p class="browser-exercise__notice">
      編集内容はこのブラウザのLocalStorageだけに保存され、GitHubや外部サーバーには送信されません。Cmd/Ctrl
      + Enterで実行できます。
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
.browser-exercise__heading {
  display: flex;
  align-items: center;
}
.browser-exercise__header {
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.browser-exercise__heading {
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
.browser-exercise__editor-wrap {
  position: relative;
  height: 320px;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.browser-exercise__highlight,
.browser-exercise__editor {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 16px 16px 16px 58px;
  border: 0;
  white-space: pre;
  overflow: auto;
  font: 13px/1.65 var(--vp-font-family-mono);
  tab-size: 2;
}
.browser-exercise__highlight {
  pointer-events: none;
  color: var(--vp-c-text-1);
}
.browser-exercise__editor {
  z-index: 1;
  resize: none;
  color: transparent;
  caret-color: var(--vp-c-text-1);
  background: transparent;
  outline: none;
}
.browser-exercise__editor::selection {
  background: color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
}
.browser-exercise__lines {
  position: absolute;
  z-index: 2;
  top: 16px;
  bottom: 16px;
  left: 0;
  width: 42px;
  overflow: hidden;
  color: var(--vp-c-text-3);
  text-align: right;
  font: 13px/1.65 var(--vp-font-family-mono);
  pointer-events: none;
}
.browser-exercise__lines span {
  display: block;
}
.browser-exercise__highlight :deep(.tok-comment) {
  color: #7f8c8d;
}
.browser-exercise__highlight :deep(.tok-string) {
  color: #b7791f;
}
.browser-exercise__highlight :deep(.tok-keyword) {
  color: #7c3aed;
}
.browser-exercise__highlight :deep(.tok-number) {
  color: #0984a3;
}
.browser-exercise__preview {
  box-sizing: border-box;
  width: 100%;
  height: 320px;
  border: 0;
  background: var(--vp-c-bg);
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
  .browser-exercise__editor-wrap,
  .browser-exercise__preview {
    height: 280px;
  }
}
</style>
