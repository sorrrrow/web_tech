"use strict";

function minDigit(x) {
  if (!(x >= 0 && (x | 0) === x)) return NaN;
  if (x === 0) return 0;

  let min = 9;
  while (x > 0) {
    const d = x % 10;
    if (d < min) min = d;
    x = (x - d) / 10;
  }
  return min;
}

(function () {
  const btn = document.getElementById("t3_btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const x = Number(document.getElementById("t3_x").value);
    const out = document.getElementById("t3_out");

    if (!(x >= 0 && (x | 0) === x)) {
      out.textContent = "x должно быть целым неотрицательным";
      return;
    }
    out.textContent = String(minDigit(x));
  });
})();