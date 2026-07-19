import { expect, test } from "@playwright/test";

const chapters = [
  ["10-first-render", "Hello, leaning-rct!"],
  ["20-jsx", "JSXの正体"],
  ["30-components", "こんにちは、コンポーネントさん！"],
  ["40-fiber", "最小Fiber tree"],
  ["50-reconciliation", "差分の結果"],
  ["60-hooks", "同じイベント内で2回更新"],
  ["70-effects", "Effectのcommit順序"],
  ["80-milestone", "小さなReact Todo"],
] as const;

test("各章のブラウザ演習が実行できる", async ({ page }) => {
  for (const [chapter, expected] of chapters) {
    await page.goto(chapter);
    const exercise = page.locator(".browser-exercise");
    await expect(exercise).toBeVisible({ timeout: 15_000 });
    if (chapter === "10-first-render") {
      await exercise
        .getByRole("textbox", { name: "編集するTypeScriptコード" })
        .fill(
          'document.querySelector("#app")!.textContent = "Hello, leaning-rct!";',
        );
    }
    await exercise.getByRole("button", { name: "実行" }).click();
    const preview = exercise.locator("iframe").contentFrame();
    await expect(
      preview.getByText(expected, { exact: false }).first(),
    ).toBeVisible({ timeout: 15_000 });
  }
});

test("演習は章ごとに保存・復元でき、リセットできる", async ({ page }) => {
  await page.goto("10-first-render");
  const exercise = page.locator(".browser-exercise");
  const editor = exercise.getByRole("textbox", {
    name: "編集するTypeScriptコード",
  });
  await editor.fill(
    'document.querySelector("#app")!.textContent = "保存されたコード";',
  );
  await expect(exercise.getByRole("status")).toContainText("保存済み");
  await page.reload();
  await expect(editor).toHaveValue(
    'document.querySelector("#app")!.textContent = "保存されたコード";',
  );
  await page.on("dialog", (dialog) => dialog.accept());
  await exercise
    .getByRole("button", { name: "この章のコードをリセット" })
    .click();
  await expect(editor).toHaveValue(/TODO/);
});

test("サイドバーを折りたたむとコンテンツがウィンドウ幅まで広がる", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("20-jsx");

  const content = page.locator(".VPContent");
  const sidebar = page.locator(".VPSidebar");
  const exercise = page.locator(".browser-exercise");
  const expandedWidth = await exercise.evaluate(
    (element) => element.getBoundingClientRect().width,
  );

  await page.getByRole("button", { name: "サイドバーを折りたたむ" }).click();
  await expect(sidebar).toBeHidden();
  await expect(content).toHaveCSS("padding-left", "0px");
  await expect
    .poll(() =>
      exercise.evaluate((element) => element.getBoundingClientRect().width),
    )
    .toBeGreaterThan(expandedWidth);

  await page.reload();
  await expect(sidebar).toBeHidden();
  await page.getByRole("button", { name: "サイドバーを展開する" }).click();
  await expect(sidebar).toBeVisible();
});

test("エラー表示、行番号、ハイライト、ショートカットを備える", async ({
  page,
}) => {
  await page.goto("20-jsx");
  const exercise = page.locator(".browser-exercise");
  const editor = exercise.getByRole("textbox", {
    name: "編集するTypeScriptコード",
  });
  await expect(exercise).toBeVisible({ timeout: 15_000 });
  await expect(exercise.locator(".browser-exercise__lines")).toContainText("1");
  const keyword = exercise.locator(".tok-keyword").first();
  await expect(keyword).toBeVisible();
  await expect(keyword).toHaveCSS("color", "rgb(124, 58, 237)");
  await expect(exercise.locator("iframe")).toHaveAttribute(
    "sandbox",
    "allow-scripts",
  );
  await editor.fill("const = ;");
  await editor.press("Control+Enter");
  await expect(
    exercise
      .locator("iframe")
      .contentFrame()
      .getByText("行1:", { exact: false }),
  ).toBeVisible({ timeout: 15_000 });
  await editor.fill('throw new Error("実行時エラー");');
  await editor.press("Control+Enter");
  await expect(
    exercise
      .locator("iframe")
      .contentFrame()
      .getByText("実行時エラー", { exact: false }),
  ).toBeVisible({ timeout: 15_000 });
  const saved = await page.evaluate(() =>
    Object.keys(localStorage).find((key) => key.includes("20-jsx")),
  );
  expect(saved).toBe("leaning-rct:exercise:v1:20-jsx");
});

test("文字列を入力してもハイライトとカーソル位置がずれない", async ({
  page,
}) => {
  await page.goto("10-first-render");
  const exercise = page.locator(".browser-exercise");
  const editor = exercise.getByRole("textbox", {
    name: "編集するTypeScriptコード",
  });
  const source = 'const message = "const 42"; // return';

  await editor.fill("const message = ");
  await editor.pressSequentially('"const 42"; // return');

  await expect(editor).toHaveValue(source);
  await expect(exercise.locator(".browser-exercise__highlight")).toHaveText(
    `${source}\n`,
  );
  await expect(exercise.locator(".tok-keyword")).toHaveText(["const"]);
  await expect(exercise.locator(".tok-string")).toHaveText('"const 42"');
  await expect(exercise.locator(".tok-comment")).toHaveText("// return");
  await expect(exercise.locator(".tok-number")).toHaveCount(0);
  await expect(editor).toHaveJSProperty("selectionStart", source.length);
  await expect(editor).toHaveJSProperty("selectionEnd", source.length);
});
