"use strict";

function cesar(str, shift, action) {
  const abc = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const len = abc.length;

  let s = shift % len;
  if (s < 0) s = s + len;
  if (action === "decode") s = (len - s) % len;

  let result = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const lower = ch.toLowerCase();

    let idx = -1;
    for (let j = 0; j < len; j++) {
      if (abc[j] === lower) {
        idx = j;
        break;
      }
    }

    if (idx === -1) {
      result += ch;
      continue;
    }

    const newIdx = (idx + s) % len;
    const mapped = abc[newIdx];
    result += (ch === lower) ? mapped : mapped.toUpperCase();
  }
  return result;
}

(function () {
  const btn = document.getElementById("t7_btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const str = document.getElementById("t7_str").value;
    const shift = Number(document.getElementById("t7_shift").value);
    const action = document.getElementById("t7_action").value;
    const out = document.getElementById("t7_out");

    if (!((shift | 0) === shift && shift >= 0)) {
      out.textContent = "shift должен быть целым неотрицательным";
      return;
    }
    out.textContent = cesar(str, shift, action);
  });
})();