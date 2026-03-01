"use strict";

function pluralizeRecords(n) {
  if (!(n >= 0 && (n | 0) === n)) return "n должно быть целым неотрицательным";

  const n100 = n % 100;
  const n10 = n % 10;

  let word;
  if (n100 >= 11 && n100 <= 14) word = "записей";
  else if (n10 === 1) word = "запись";
  else if (n10 >= 2 && n10 <= 4) word = "записи";
  else word = "записей";

  return "В результате выполнения запроса было найдено " + n + " " + word;
}

(function () {
  const btn = document.getElementById("t4_btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const n = Number(document.getElementById("t4_n").value);
    const out = document.getElementById("t4_out");
    out.textContent = pluralizeRecords(n);
  });
})();