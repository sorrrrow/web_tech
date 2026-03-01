"use strict";

function getSortedArray(array, key) {
  const copy = array.slice();

  for (let i = 1; i < copy.length; i++) {
    const current = copy[i];
    const curVal = current[key];
    let j = i - 1;

    while (j >= 0) {
      const leftVal = copy[j][key];

      let cmp = 0;
      if (typeof leftVal === "number" && typeof curVal === "number") {
        if (leftVal < curVal) cmp = -1;
        else if (leftVal > curVal) cmp = 1;
        else cmp = 0;
      } else {
        const a = String(leftVal);
        const b = String(curVal);
        if (a < b) cmp = -1;
        else if (a > b) cmp = 1;
        else cmp = 0;
      }

      if (cmp <= 0) break;
      copy[j + 1] = copy[j];
      j = j - 1;
    }
    copy[j + 1] = current;
  }

  return copy;
}

(function () {
  const btn = document.getElementById("t6_btn");
  if (!btn) return;

  const sample = [
    { name: "Olga", age: 22 },
    { name: "Anna", age: 19 },
    { name: "Ivan", age: 25 },
    { name: "Boris", age: 25 }
  ];

  const out = document.getElementById("t6_out");
  out.textContent = JSON.stringify(sample, null, 2);

  btn.addEventListener("click", () => {
    const key = document.getElementById("t6_key").value;
    const res = getSortedArray(sample, key);
    out.textContent = JSON.stringify(res, null, 2);
  });
})();