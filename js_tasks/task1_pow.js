"use strict";

function pow(x, n) {
  if (!(n > 0 && (n | 0) === n)) return NaN;
  let result = 1;
  let i = 0;
  while (i < n) {
    result = result * x;
    i = i + 1;
  }
  return result;
}

(function () {
  const btn = document.getElementById("t1_btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const x = Number(document.getElementById("t1_x").value);
    const n = Number(document.getElementById("t1_n").value);
    const out = document.getElementById("t1_out");

    if (!(n > 0 && (n | 0) === n)) {
      out.textContent = "n должно быть натуральным целым числом";
      return;
    }
    out.textContent = String(pow(x, n));
  });
})();