"use strict";

function fibb(n) {
  if (!(n >= 0 && n <= 1000 && (n | 0) === n)) return null;
  if (n === 0) return 0n;
  if (n === 1) return 1n;

  let a = 0n;
  let b = 1n;
  let i = 2;

  while (i <= n) {
    const c = a + b;
    a = b;
    b = c;
    i = i + 1;
  }
  return b;
}

(function () {
  const btn = document.getElementById("t5_btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const n = Number(document.getElementById("t5_n").value);
    const out = document.getElementById("t5_out");

    const res = fibb(n);
    if (res === null) {
      out.textContent = "n должно быть целым от 0 до 1000";
      return;
    }
    out.textContent = String(res);
  });
})();