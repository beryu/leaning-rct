import { expect, test } from "@playwright/test";

test("Todoを追加して完了にできる", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "小さなReactで、Todoを動かす。" }),
  ).toBeVisible();
  await page.getByLabel("新しいTodo").fill("Effectを理解する");
  await page.getByRole("button", { name: "追加する" }).click();
  const todo = page.getByRole("button", {
    name: "Effectを理解するを完了にする",
  });
  await expect(todo).toBeVisible();
  await todo.click();
  await expect(
    page.getByRole("button", { name: "Effectを理解するを未完了にする" }),
  ).toBeVisible();
});
