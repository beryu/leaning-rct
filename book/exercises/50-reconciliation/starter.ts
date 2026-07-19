type Child = { key: string; type: string; label: string };
const previous: Child[] = [
  { key: "a", type: "li", label: "A" },
  { key: "b", type: "li", label: "B" },
  { key: "c", type: "li", label: "C" },
];
const next: Child[] = [
  { key: "c", type: "li", label: "C" },
  { key: "b", type: "li", label: "B (更新)" },
  { key: "d", type: "li", label: "D (追加)" },
];
const oldByKey = new Map(previous.map((child) => [child.key, child]));
const result = next.map((child) => {
  const old = oldByKey.get(child.key);
  oldByKey.delete(child.key);
  return `${old ? (old.label === child.label ? "再利用" : "更新") : "追加"}: ${child.label}`;
});
for (const child of oldByKey.values()) result.push(`削除: ${child.label}`);
document.querySelector("#app")!.innerHTML =
  `<h2>差分の結果</h2><ul>${result.map((item) => `<li>${item}</li>`).join("")}</ul>`;
console.log("keyで同一性を比較", result);
