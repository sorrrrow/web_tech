"use strict";

function gcd(a, b) {
  if (a < 0 || b < 0) return NaN;
  if ((a | 0) !== a || (b | 0) !== b) return NaN;
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

(function () {
  const btn = document.getElementById("t2_btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const a = Number(document.getElementById("t2_a").value);
    const b = Number(document.getElementById("t2_b").value);
    const out = document.getElementById("t2_out");

    if (!(a >= 0 && b >= 0 && (a | 0) === a && (b | 0) === b)) {
      out.textContent = "a и b должны быть целыми неотрицательными";
      return;
    }
    out.textContent = String(gcd(a, b));
  });
})();