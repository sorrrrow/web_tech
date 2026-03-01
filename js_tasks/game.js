"use strict";

(function () {
  const elLevel = document.getElementById("g_level");
  const elQCount = document.getElementById("g_qcount");
  const elOk = document.getElementById("g_ok");
  const elBad = document.getElementById("g_bad");
  const elQuestion = document.getElementById("g_question");
  const elAnswer = document.getElementById("g_answer");
  const elSubmit = document.getElementById("g_submit");
  const elStart = document.getElementById("g_start");
  const elRestart = document.getElementById("g_restart");
  const elExit = document.getElementById("g_exit");
  const elMsg = document.getElementById("g_msg");

  if (!elStart) return;

  const LEVELS = [
    { name: "начальный", type: 1 },
    { name: "средний", type: 2 },
    { name: "продвинутый", type: 3 }
  ];

  let levelIndex = 0;
  let asked = new Set();
  let ok = 0;
  let bad = 0;
  let qNum = 0;
  let current = null;
  let playing = false;

  function randInt(min, max) {
    return ((Math.random() * (max - min + 1)) | 0) + min;
  }

  function setEnabled(isPlaying) {
    elAnswer.disabled = !isPlaying;
    elSubmit.disabled = !isPlaying;
    elRestart.disabled = !isPlaying;
    elExit.disabled = !isPlaying;
  }

  function updateStats() {
    elLevel.textContent = "Уровень: " + (playing ? LEVELS[levelIndex].name : "—");
    elQCount.textContent = "Вопрос: " + qNum + " / 10";
    elOk.textContent = String(ok);
    elBad.textContent = String(bad);
  }

  function say(text) {
    elMsg.textContent = text;
  }

  function normalizeAnswer(s) {
    let start = 0;
    let end = s.length - 1;
    while (start <= end && (s[start] === " " || s[start] === "\n" || s[start] === "\t" || s[start] === "\r")) start++;
    while (end >= start && (s[end] === " " || s[end] === "\n" || s[end] === "\t" || s[end] === "\r")) end--;
    return s.slice(start, end + 1);
  }

  function makeQuestion(levelType) {
    for (let tries = 0; tries < 4000; tries++) {
      let q = null;

      if (levelType === 1) {
        const a = randInt(1, 25);
        const b = randInt(1, 25);
        const ops = ["+", "-", "*", "/"];
        const op = ops[randInt(0, ops.length - 1)];

        let text, answer;
        if (op === "+") {
          answer = a + b;
          text = a + " + " + b + " = ?";
        } else if (op === "-") {
          const x = a + b;
          answer = x - a;
          text = x + " - " + a + " = ?";
        } else if (op === "*") {
          const x = randInt(1, 12);
          const y = randInt(1, 12);
          answer = x * y;
          text = x + " * " + y + " = ?";
        } else {
          const d = randInt(1, 12);
          const qv = randInt(1, 12);
          const x = d * qv;
          answer = qv;
          text = x + " / " + d + " = ?";
        }
        q = { text, answer: String(answer) };
      }

      if (levelType === 2) {
        const a = randInt(0, 30);
        const b = randInt(0, 30);
        const ops = ["<", ">", "<=", ">=", "==", "!="];
        const op = ops[randInt(0, ops.length - 1)];

        let ansBool;
        if (op === "<") ansBool = (a < b);
        else if (op === ">") ansBool = (a > b);
        else if (op === "<=") ansBool = (a <= b);
        else if (op === ">=") ansBool = (a >= b);
        else if (op === "==") ansBool = (a == b);
        else ansBool = (a != b);

        q = { text: a + " " + op + " " + b + " ? (true/false)", answer: ansBool ? "true" : "false" };
      }

      if (levelType === 3) {
        const mode = randInt(1, 2);

        if (mode === 1) {
          const a = randInt(0, 1);
          const b = randInt(0, 1);
          const c = randInt(0, 1);
          const forms = [
            { t: "(" + a + " && " + b + ") || " + c, v: ((a && b) || c) ? "true" : "false" },
            { t: a + " || (" + b + " && " + c + ")", v: (a || (b && c)) ? "true" : "false" },
            { t: "!(" + a + " && " + b + ") && " + c, v: (!(a && b) && c) ? "true" : "false" }
          ];
          const pick = forms[randInt(0, forms.length - 1)];
          q = { text: pick.t + " ? (true/false)", answer: pick.v };
        } else {
          const x = randInt(1, 31);
          const y = randInt(1, 31);
          const ops = ["&", "|", "^"];
          const op = ops[randInt(0, ops.length - 1)];
          let ans;
          if (op === "&") ans = (x & y);
          else if (op === "|") ans = (x | y);
          else ans = (x ^ y);
          q = { text: x + " " + op + " " + y + " = ?", answer: String(ans) };
        }
      }

      if (q && !asked.has(q.text)) {
        asked.add(q.text);
        return q;
      }
    }
    return { text: "1 + 1 = ?", answer: "2" };
  }

  function nextQuestion() {
    say("");
    elAnswer.value = "";

    if (qNum >= 10) {
      finishLevel();
      return;
    }

    qNum = qNum + 1;
    current = makeQuestion(LEVELS[levelIndex].type);
    elQuestion.textContent = current.text;
    updateStats();
    elAnswer.focus();
  }

  function finishLevel() {
    elAnswer.disabled = true;
    elSubmit.disabled = true;

    const passed = ok >= 8;

    if (levelIndex < 2) {
      if (passed) {
        say("Уровень пройден. Переход на следующий уровень.");
        levelIndex = levelIndex + 1;
        asked = new Set();
        ok = 0;
        bad = 0;
        qNum = 0;
        current = null;
        elAnswer.disabled = false;
        elSubmit.disabled = false;
        updateStats();
        nextQuestion();
      } else {
        say("Уровень не пройден. Можно перезапустить или выйти.");
        elQuestion.textContent = "Уровень завершен.";
      }
      return;
    }

    if (passed) {
      say("Поздравляем. Игра завершена.");
    } else {
      say("Игра завершена. Можно перезапустить или выйти.");
    }
    elQuestion.textContent = "Игра завершена.";
  }

  function checkAnswer() {
    if (!playing || !current) return;

    const user = normalizeAnswer(elAnswer.value);
    if (user === "") {
      say("Введите ответ.");
      return;
    }

    if (user === current.answer) {
      ok = ok + 1;
      say("Верно.");
    } else {
      bad = bad + 1;
      say("Неверно. Правильный ответ: " + current.answer);
    }
    updateStats();

    setTimeout(() => nextQuestion(), 350);
  }

  function startGame() {
    playing = true;
    levelIndex = 0;
    asked = new Set();
    ok = 0;
    bad = 0;
    qNum = 0;
    current = null;
    setEnabled(true);
    updateStats();
    elQuestion.textContent = "Игра началась.";
    nextQuestion();
  }

  function restartGame() {
    startGame();
  }

  function exitGame() {
    playing = false;
    asked = new Set();
    ok = 0;
    bad = 0;
    qNum = 0;
    current = null;
    setEnabled(false);
    updateStats();
    elAnswer.value = "";
    elQuestion.textContent = "Нажмите «Начать».";
    say("");
  }

  elStart.addEventListener("click", startGame);
  elRestart.addEventListener("click", restartGame);
  elExit.addEventListener("click", exitGame);
  elSubmit.addEventListener("click", checkAnswer);

  elAnswer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !elSubmit.disabled) checkAnswer();
  });

  setEnabled(false);
  updateStats();
})();