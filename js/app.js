// =============================================================
// C++ Homework Assignment — Main Application
// - Reads version from URL (?v=A / B / C / D)
// - Shuffles MC bank deterministically per version (seeded)
// - Anti-cheating: fixed tab-switch double-count bug
// - Starter code: uses value (not placeholder) so it persists
// =============================================================

const EXAM_DURATION = 80 * 60;

let studentInfo = { group: "", id: "", firstName: "", lastName: "" };
let examVersion = null;
let versionData = null;
let mcQuestions = [];
let optionOrders = [];
let userAnswers = [];
let startTime = null;
let timerInterval = null;
let tabSwitches = 0;
let examEnded = false;
let starterCodeStripped = [false, false];

// ---------------- Helpers ----------------
function $(id) {
  return document.getElementById(id);
}

// Seeded pseudo-random — Mulberry32
function seededRNG(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function flash(msg) {
  const el = $("flash");
  if (!el) return;
  el.innerHTML =
    '<span class="flash-icon" aria-hidden="true">!</span>' +
    '<span class="flash-text">' +
    msg +
    "</span>";
  el.style.display = "flex";
  clearTimeout(window._flashT);
  window._flashT = setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}

// ---------------- Question selection ----------------
// Pick 30 questions from the bank.
// Uses seeded shuffle so each version gets a DIFFERENT selection + ordering.
// The options inside each question are ALSO shuffled (seeded separately).
// Rule: no 3 consecutive questions should have correct answer at same DISPLAYED position
// (after option shuffle). Displayed position = where q.correct ends up after shuffling.
function selectArrangeAndShuffle(bank, seed) {
  const rng = seededRNG(seed);
  // Shuffle entire bank
  const shuffled = seededShuffle(bank, rng);
  // Take first 30
  const selected = shuffled.slice(0, 30);

  // Shuffle options for each question (different seeded RNG)
  const rngOpts = seededRNG(seed + "_opts");
  const optionOrders = selected.map(() => seededShuffle([0, 1, 2, 3], rngOpts));

  // Compute displayed-correct-position for each question
  // displayedCorrect[i] = position where correct answer appears after option shuffle
  function getDisplayedCorrect(idx) {
    return optionOrders[idx].indexOf(selected[idx].correct);
  }

  // Greedy: if 3 consecutive displayed-correct positions are the same, swap with a later question
  // Rule: max 2 consecutive same (so detection triggers on 3-in-a-row)
  for (let attempt = 0; attempt < 100; attempt++) {
    let fixed = false;
    for (let i = 2; i < selected.length; i++) {
      const d0 = getDisplayedCorrect(i);
      const d1 = getDisplayedCorrect(i - 1);
      const d2 = getDisplayedCorrect(i - 2);
      if (d0 === d1 && d0 === d2) {
        // Find a later question with different displayed correct
        for (let j = i + 1; j < selected.length; j++) {
          if (getDisplayedCorrect(j) !== d0) {
            // Swap both the question AND its option order
            [selected[i], selected[j]] = [selected[j], selected[i]];
            [optionOrders[i], optionOrders[j]] = [
              optionOrders[j],
              optionOrders[i],
            ];
            fixed = true;
            break;
          }
        }
      }
    }
    if (!fixed) break;
  }

  return { selected, optionOrders };
}

// ---------------- Version selection ----------------
// On welcome page: read version from URL if set
const urlParams = new URLSearchParams(window.location.search);
const preselectedVersion = urlParams.get("v");

if (
  preselectedVersion &&
  ["A", "B", "C", "D"].includes(preselectedVersion.toUpperCase())
) {
  // Auto-select
  const v = preselectedVersion.toUpperCase();
  examVersion = v;
}

function selectVersion(letter) {
  examVersion = letter;
  // Update UI
  document
    .querySelectorAll(".version-card")
    .forEach((c) => c.classList.remove("selected"));
  const card = document.querySelector(
    '.version-card[data-version="' + letter + '"]',
  );
  if (card) card.classList.add("selected");
  validateForm();
}

// ---------------- Form validation ----------------
// Capitalize first letter of each word: "john smith" -> "John Smith", "MARY" -> "Mary"
function capitalizeName(s) {
  return (s || "").toLowerCase().replace(/\b([a-z'])/g, function (m) {
    return m.toUpperCase();
  });
}

function validateForm() {
  studentInfo.group = $("studentGroup") ? $("studentGroup").value : "";
  studentInfo.id = $("studentId") ? $("studentId").value.trim() : "";
  studentInfo.firstName = capitalizeName(
    $("studentFirstName") ? $("studentFirstName").value.trim() : "",
  );
  studentInfo.lastName = capitalizeName(
    $("studentLastName") ? $("studentLastName").value.trim() : "",
  );

  // Student ID must be exactly 6 digits
  const idValid = /^\d{6}$/.test(studentInfo.id);
  $("idHint").style.color =
    studentInfo.id.length > 0 && !idValid
      ? "var(--danger)"
      : "var(--ink-medium)";

  const valid =
    examVersion &&
    studentInfo.group &&
    idValid &&
    studentInfo.firstName &&
    studentInfo.lastName;
  if ($("startBtn")) $("startBtn").disabled = !valid;
  return valid;
}

// ---------------- Start exam ----------------
function startExam() {
  if (!validateForm()) return;

  // Load version data
  if (examVersion === "A") versionData = window.VERSION_A;
  else if (examVersion === "B") versionData = window.VERSION_B;
  else if (examVersion === "C") versionData = window.VERSION_C;
  else if (examVersion === "D") versionData = window.VERSION_D;
  if (!versionData) return;

  // Select 30 questions and determine option shuffle
  const result = selectArrangeAndShuffle(
    window.MC_BANK,
    versionData.shuffleSeed,
  );
  mcQuestions = result.selected;
  optionOrders = result.optionOrders;
  userAnswers = new Array(mcQuestions.length).fill(-1);

  // Navigate to exam page
  const params = new URLSearchParams();
  params.set("v", examVersion);
  params.set("g", studentInfo.group);
  params.set("id", studentInfo.id);
  params.set("fn", studentInfo.firstName);
  params.set("ln", studentInfo.lastName);

  // Save state for exam page to pick up
  sessionStorage.setItem(
    "exam_state",
    JSON.stringify({
      info: studentInfo,
      version: examVersion,
      questions: mcQuestions,
      optionOrders: optionOrders,
      codingStarters: versionData.coding.map((c) => c.starter),
    }),
  );

  window.location.href = "exam.html?" + params.toString();
}

// ---------------- Exam page initialization ----------------
function initExamPage() {
  const stored = sessionStorage.getItem("exam_state");
  if (!stored) {
    alert("Exam state not found. Returning to start.");
    window.location.href = "index.html";
    return;
  }
  const state = JSON.parse(stored);
  studentInfo = state.info;
  examVersion = state.version;
  mcQuestions = state.questions;
  optionOrders = state.optionOrders;
  userAnswers = new Array(mcQuestions.length).fill(-1);

  // Also set versionData for solutions reference
  if (examVersion === "A") versionData = window.VERSION_A;
  else if (examVersion === "B") versionData = window.VERSION_B;
  else if (examVersion === "C") versionData = window.VERSION_C;
  else if (examVersion === "D") versionData = window.VERSION_D;

  // Populate new 2-card exam header
  $("studentName").textContent =
    studentInfo.firstName + " " + studentInfo.lastName;
  $("studentGroupLbl").textContent = studentInfo.group;
  $("studentIdLbl").textContent = studentInfo.id;
  $("versionBadge").textContent = "Exam Version " + examVersion;

  renderQuestions();
  renderCoding();
  startTimer();
  $("timer").style.display = "block";
  $("tabcount").style.display = "block";

  // Expose for debugging / testing (not essential)
  window._exam = { mcQuestions, userAnswers, optionOrders };
}

// ---------------- Render questions ----------------
function renderQuestions() {
  const root = $("questions-root");
  root.innerHTML = "";
  mcQuestions.forEach((q, qIdx) => {
    const ord = optionOrders[qIdx];
    const card = document.createElement("div");
    card.className = "q-card";
    card.innerHTML = `
      <div class="q-num">Question ${qIdx + 1} / ${mcQuestions.length} · Savol ${qIdx + 1} / ${mcQuestions.length}</div>
      <div class="q-text">${q.en}</div>
      <div class="q-text-uz">${q.uz}</div>
      <div class="opt-list">
        ${ord
          .map((origIdx, displayIdx) => {
            const letter = String.fromCharCode(65 + displayIdx);
            return `<div class="opt" data-q="${qIdx}" data-orig="${origIdx}">
            <span class="letter">${letter})</span>
            <div class="opt-content">
              <div class="opt-text">${q.opts[origIdx].en}</div>
              <div class="opt-text-uz">${q.opts[origIdx].uz}</div>
            </div>
          </div>`;
          })
          .join("")}
      </div>
    `;
    root.appendChild(card);
  });

  root.querySelectorAll(".opt").forEach((el) => {
    el.addEventListener("click", () => {
      const qIdx = parseInt(el.dataset.q);
      const origIdx = parseInt(el.dataset.orig);
      userAnswers[qIdx] = origIdx;
      el.parentElement
        .querySelectorAll(".opt")
        .forEach((o) => o.classList.remove("selected"));
      el.classList.add("selected");
      updateProgress();
    });
  });
}

// ---------------- Render coding problems ----------------
function renderCoding() {
  const root = $("coding-root");
  root.innerHTML = "";
  versionData.coding.forEach((cp, i) => {
    const card = document.createElement("div");
    card.className = "code-card";

    // Abstract hint bullets (no step numbers)
    const hintsHtml = (cp.hints || [])
      .map(
        (h) => `
      <div class="hint-item">
        <div class="hint-en">${h.en}</div>
        <div class="hint-uz">${h.uz}</div>
      </div>
    `,
      )
      .join("");

    card.innerHTML = `
      <div class="code-header-row">
        <div class="code-badge">
          <span class="code-badge-num">${i + 1}</span>
          <span class="code-badge-label">Problem ${i + 1}<span class="uz">${i + 1}-Masala</span></span>
        </div>
        <div class="code-points-pill">Max 20 points<span class="pill-uz"> · 20 ball</span></div>
      </div>
      <h3>${cp.title_en}<span class="uz">${cp.title_uz}</span></h3>
      <div class="lang-label">Requirements (English):</div>
      <p>Write a C++ program that:</p>
      <ol>${cp.en.map((s) => `<li>${s}</li>`).join("")}</ol>
      <div class="lang-label uz">Talablar (O'zbekcha):</div>
      <p style="font-style:italic;color:var(--ink-medium)">Quyidagilarni bajaradigan C++ dastur yozing:</p>
      <ol class="uz">${cp.uz.map((s) => `<li>${s}</li>`).join("")}</ol>
      ${
        hintsHtml
          ? `
        <div class="hints-panel">
          <div class="hints-title">
            <span class="hints-title-en">Hints to Solve the Problem</span>
            <span class="hints-title-uz">Masalani Yechish uchun Maslahatlar</span>
          </div>
          ${hintsHtml}
        </div>
      `
          : ""
      }
      <div class="code-editor-wrap" data-editor-idx="${i + 1}">
        <pre class="code-editor-highlight" aria-hidden="true"></pre>
        <textarea id="code${i + 1}" class="code-editor-input" spellcheck="false"></textarea>
      </div>
    `;
    root.appendChild(card);

    // Set up the colored code editor overlay
    const ta = $(`code${i + 1}`);
    const highlight = card.querySelector(".code-editor-highlight");
    ta.value = cp.starter;
    renderHighlight(ta.value, highlight);

    ta.addEventListener("input", () => renderHighlight(ta.value, highlight));
    ta.addEventListener("scroll", () => {
      highlight.scrollTop = ta.scrollTop;
      highlight.scrollLeft = ta.scrollLeft;
    });
  });
}

// Render a simple C++ syntax highlight: comments in color, rest in default
function renderHighlight(code, el) {
  const lines = code.split("\n");
  const html = lines
    .map((line) => {
      // Escape HTML
      let escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Find // comment
      const idx = escaped.indexOf("//");
      if (idx !== -1) {
        const before = escaped.substring(0, idx);
        const comment = escaped.substring(idx);
        // Detect Uzbek: (a) has apostrophe-between-letters patterns common in Uzbek like o' and g',
        // OR (b) contains common Uzbek words. Covers our TODO comment phrasing.
        const uzHint =
          /[a-z]'[a-z]|\b(ning|uchun|yoki|agar|har|gacha|dan|kiriting|so'rang|chaqiring|tekshiring|saqlang|hisoblang|topish|oshiring|yozing|qo'shing|eting|sikl[ia]?|massiv(ga|ni)?|sonlar?|sonni|satr|belgi|misol|raqam|qator|bo'lsa|yechim|QADAM)\b/i;
        const isUzbek = uzHint.test(comment);
        const cls = isUzbek ? "c-uz" : "c-en";
        return before + '<span class="' + cls + '">' + comment + "</span>";
      }
      return escaped;
    })
    .join("\n");
  // Add trailing space to preserve final newline visually
  el.innerHTML = html + "\n";
}

// ---------------- Progress ----------------
function updateProgress() {
  const answered = userAnswers.filter((a) => a !== -1).length;
  const pct = (answered / mcQuestions.length) * 100;
  $("progress-fill").style.width = pct + "%";
  $("progress-text").textContent =
    `Answered ${answered} / ${mcQuestions.length} test questions · ${answered} / ${mcQuestions.length} test savoliga javob berildi`;
  $("answered-count").textContent = answered;
  $("answered-count-uz").textContent = answered;
}

// ---------------- Timer ----------------
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remaining = EXAM_DURATION - elapsed;
  if (remaining <= 0) {
    clearInterval(timerInterval);
    showModal({
      type: "warning",
      title: "Time's Up!",
      titleUz: "Vaqt tugadi!",
      message:
        "Your time has expired. The exam is being submitted automatically. <span class='uz'>Vaqtingiz tugadi. Imtihon avtomatik yuborilmoqda.</span>",
      okText: "OK",
    }).then(() => performSubmit());
    setTimeout(() => {
      if (!examEnded) performSubmit();
    }, 4000);
    return;
  }
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  $("timer-val").innerHTML =
    String(mins).padStart(2, "0") +
    '<span style="font-size:0.7em;opacity:.7;font-weight:500"> min </span>' +
    String(secs).padStart(2, "0") +
    '<span style="font-size:0.7em;opacity:.7;font-weight:500"> sec</span>';
  const t = $("timer");
  t.classList.remove("warning", "danger");
  if (remaining <= 60) t.classList.add("danger");
  else if (remaining <= 5 * 60) t.classList.add("warning");
}

// ---------------- Anti-cheating ----------------
// FIX: tab-switch counter was firing TWICE per switch (one for visibilitychange,
// one for window.blur). We now use only visibilitychange + a debounce.
let _lastTabSwitchAt = 0;
function registerTabSwitch() {
  const now = Date.now();
  if (now - _lastTabSwitchAt < 500) return; // debounce duplicate events
  _lastTabSwitchAt = now;
  tabSwitches++;
  if ($("tabcount-val")) $("tabcount-val").textContent = tabSwitches;
  if ($("tabcount")) $("tabcount").classList.add("flagged");
  flash(
    `Warning: Tab switch detected! (${tabSwitches}) / Ogohlantirish: Yorliq almashtirish aniqlandi!`,
  );
}

function examStarted() {
  return $("test") && $("test").style.display !== "none" && !examEnded;
}

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (examStarted())
    flash(
      "Mouse Right-click is disabled! / Sichqoncha o'ng tugmasini bosish ruxsat etilmaydi!",
    );
  return false;
});
["copy", "cut"].forEach((evt) => {
  document.addEventListener(evt, (e) => {
    const t = e.target;
    if (
      t.tagName === "TEXTAREA" ||
      (t.tagName === "INPUT" && t.type === "text")
    )
      return;
    e.preventDefault();
  });
});
document.addEventListener("paste", (e) => {
  const t = e.target;
  if (t.tagName === "TEXTAREA" && examStarted()) {
    e.preventDefault();
    flash(
      "Copy-Pasting is disabled in the code editor area! / Kod yozish xududiga nusxalar joylashtirish mumkin emas!",
    );
  }
});
document.addEventListener("keydown", (e) => {
  if (!examStarted()) return;
  const k = e.key.toLowerCase();

  // Block DevTools shortcuts on Windows/Linux (Ctrl+Shift+I/J/C, F12)
  // AND on Mac Safari/Chrome (Cmd+Opt+I/J/C/U, Cmd+Opt+R)
  if (
    k === "f12" ||
    (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
    (e.metaKey &&
      e.altKey &&
      (k === "i" || k === "j" || k === "c" || k === "u" || k === "r")) ||
    (e.ctrlKey && k === "u") || // Ctrl+U view source (Win/Linux)
    (e.metaKey && k === "u") || // Cmd+U view source (Mac)
    (e.metaKey && e.altKey && k === "a") // Cmd+Opt+A Safari responsive design mode
  ) {
    e.preventDefault();
    flash(
      "Developer tools are disabled! / Ishlab chiqaruvchi vositalari o'chirilgan!",
    );
  }

  // Block paste in textareas (both Ctrl+V and Cmd+V)
  if ((e.ctrlKey || e.metaKey) && k === "v") {
    const t = e.target;
    if (t.tagName === "TEXTAREA") {
      e.preventDefault();
      flash(
        "Copy-Pasting is disabled in the code editor area! / Kod yozish xududiga nusxalar joylashtirish mumkin emas!",
      );
    }
  }

  // Block Cmd+P (print) during exam — students might print answer key view
  if ((e.ctrlKey || e.metaKey) && k === "p") {
    e.preventDefault();
    flash(
      "Printing is disabled during the exam! / Imtihon paytida chop etish mumkin emas!",
    );
  }

  // Block Cmd+S (save page) during exam
  if ((e.ctrlKey || e.metaKey) && k === "s") {
    e.preventDefault();
    flash(
      "Saving is disabled during the exam! / Imtihon paytida saqlash mumkin emas!",
    );
  }
});
// FIX: only visibilitychange, not window.blur (prevents double counting)
document.addEventListener("visibilitychange", () => {
  if (examStarted() && document.hidden) {
    registerTabSwitch();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (examStarted()) {
    e.preventDefault();
    e.returnValue = "";
    return "";
  }
});

// ---------------- Modal ----------------
let _modalResolve = null;
function showModal({
  type = "warning",
  title,
  titleUz,
  message,
  progress,
  okText = "OK",
  cancelText = null,
}) {
  return new Promise((resolve) => {
    _modalResolve = resolve;
    const box = $("modal-box");
    if (!box) {
      resolve(true);
      return;
    }
    box.className =
      "modal " +
      (type === "success" ? "success" : type === "info" ? "info" : "");
    const icons = { warning: "!", success: "✓", info: "i", error: "✗" };
    $("modal-icon").textContent = icons[type] || "!";
    const titleEl = $("modal-title");
    // Clear previous child text nodes
    titleEl.childNodes.forEach((n) => {
      if (n.nodeType === 3) n.nodeValue = "";
    });
    titleEl.insertBefore(
      document.createTextNode(title + " "),
      $("modal-title-uz"),
    );
    $("modal-title-uz").textContent = titleUz || "";
    $("modal-text").innerHTML = message;
    if (progress) {
      $("modal-progress").style.display = "block";
      $("modal-progress").innerHTML = progress;
    } else {
      $("modal-progress").style.display = "none";
    }
    $("modal-ok").textContent = okText;
    const cancelBtn = $("modal-cancel");
    if (cancelText) {
      cancelBtn.style.display = "inline-flex";
      cancelBtn.textContent = cancelText;
    } else {
      cancelBtn.style.display = "none";
    }
    $("modal").classList.add("show");
  });
}

// ---------------- Submit ----------------
async function trySubmit() {
  if (examEnded) return;
  const answered = userAnswers.filter((a) => a !== -1).length;
  const incomplete = answered < mcQuestions.length;
  const confirmed = await showModal({
    type: incomplete ? "warning" : "info",
    title: incomplete ? "Incomplete Submission" : "Submit Exam?",
    titleUz: incomplete ? "To'liq emas" : "Imtihonni yakunlaysizmi?",
    message: incomplete
      ? `You have not answered all test questions. Are you sure you want to submit?<span class="uz">Siz hamma test savollariga javob bermadingiz. Yuborishni xohlaysizmi?</span>`
      : `All test questions answered. Are you sure you want to submit?<span class="uz">Hamma test savollariga javob berildi. Yuborishni xohlaysizmi?</span>`,
    progress: incomplete
      ? `<b>Answered / Javob berildi:</b> ${answered} / ${mcQuestions.length}`
      : null,
    okText: "Submit / Yuborish",
    cancelText: "Cancel / Bekor qilish",
  });
  if (!confirmed) return;
  performSubmit();
}

function performSubmit() {
  if (examEnded) return;
  examEnded = true;
  clearInterval(timerInterval);

  let correct = 0;
  userAnswers.forEach((ans, idx) => {
    if (ans === mcQuestions[idx].correct) correct++;
  });
  const mcScore = correct * 2;

  const code1 = $("code1").value || "(No code submitted)";
  const code2 = $("code2").value || "(No code submitted)";
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = mins + "m " + secs + "s";

  window._submissionData = {
    correct,
    mcScore,
    code1,
    code2,
    timeStr,
    mcQuestions,
    userAnswers,
    optionOrders,
    info: studentInfo,
    version: examVersion,
    tabSwitches,
  };

  $("test").style.display = "none";
  $("timer").style.display = "none";
  $("tabcount").style.display = "none";
  $("report").style.display = "block";

  $("scorecard").style.display = "block";
  $("scorecard").innerHTML = `
    <div class="success-check">✓</div>
    <div class="score-eyebrow">Exam Finished · Imtihon Tugadi</div>

    <div class="pending-banner">
      <span class="pending-title">You finished the exam, but your submission is NOT complete yet!</span>
      <div class="pending-title-uz">Siz imtihonni tugatdingiz, lekin topshiruvingiz hali to'liq emas!</div>
      <div class="pending-message">
        You still need to upload your auto-generated PDF report to the Google Form below so your exam is officially submitted. Without this final step, your submission will NOT be counted.
      </div>
      <div class="pending-message-uz">
        Imtihoningiz rasmiy ravishda topshirilishi uchun avtomatik yaratilgan PDF hisobotingizni quyidagi Google Formaga yuklashingiz kerak. Bu yakuniy qadamsiz topshiruvingiz HISOBGA OLINMAYDI.
      </div>
    </div>

    <div class="student-info-box">
      <div class="sinfo-row">
        <div class="sinfo-label">Student Full Name<span class="sinfo-uz">Talabaning To'liq Ismi</span></div>
        <div class="sinfo-value">${studentInfo.firstName} ${studentInfo.lastName}</div>
      </div>
      <div class="sinfo-row">
        <div class="sinfo-label">Student Group<span class="sinfo-uz">Talaba Guruhi</span></div>
        <div class="sinfo-value">${studentInfo.group}</div>
      </div>
      <div class="sinfo-row">
        <div class="sinfo-label">Student ID<span class="sinfo-uz">Talaba ID</span></div>
        <div class="sinfo-value">${studentInfo.id}</div>
      </div>
      <div class="sinfo-row">
        <div class="sinfo-label">Exam Version<span class="sinfo-uz">Imtihon Versiyasi</span></div>
        <div class="sinfo-value">Version ${examVersion}</div>
      </div>
    </div>

    <div class="submit-confirm">
      <p class="confirm-main">
        Thank you! You finished the exam.<br>
        <span class="uz">Rahmat! Siz imtihonni tugatdingiz.</span>
      </p>
      <p class="confirm-sub">
        Your PDF report is downloading automatically. Please upload it to the Google Form below to officially complete your submission.
        <span class="uz">PDF hisobotingiz avtomatik yuklab olinmoqda. Topshiruvni rasmiy ravishda yakunlash uchun uni quyidagi Google Formaga yuklang.</span>
      </p>
    </div>

    <div class="summary-stats">
      <div class="stat-item">
        <div class="stat-label">Time Used<span class="sinfo-uz">Sarflangan Vaqt</span></div>
        <div class="stat-value">${timeStr}</div>
      </div>
      <div class="stat-item ${tabSwitches > 0 ? "stat-warn" : ""}">
        <div class="stat-label">Tab Switches<span class="sinfo-uz">Yorliq Almashish</span></div>
        <div class="stat-value">${tabSwitches}</div>
      </div>
    </div>

    <p class="grading-note">
      Your results will be shared by the instructor after grading is complete.<br>
      <span class="uz">Natijalaringiz baholash yakunlangandan so'ng o'qituvchi tomonidan taqdim etiladi.</span>
    </p>
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(generatePDFReport, 600);
}

// ---------------- Entry points ----------------
// Wire up on DOM ready for welcome page
document.addEventListener("DOMContentLoaded", () => {
  // Welcome page
  if ($("welcome")) {
    // Version card clicks
    document.querySelectorAll(".version-card").forEach((card) => {
      card.addEventListener("click", () => {
        const v = card.dataset.version;
        selectVersion(v);
      });
    });

    // Pre-select from URL
    if (examVersion) selectVersion(examVersion);

    // Input listeners
    [
      "studentGroup",
      "studentId",
      "studentFirstName",
      "studentLastName",
    ].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", validateForm);
        el.addEventListener("change", validateForm);
      }
    });

    if ($("startBtn")) $("startBtn").addEventListener("click", startExam);
  }

  // Exam page
  if ($("test")) {
    initExamPage();
    if ($("submitBtn")) $("submitBtn").addEventListener("click", trySubmit);
  }

  // Modal buttons (both pages)
  if ($("modal-ok"))
    $("modal-ok").addEventListener("click", () => {
      $("modal").classList.remove("show");
      if (_modalResolve) _modalResolve(true);
    });
  if ($("modal-cancel"))
    $("modal-cancel").addEventListener("click", () => {
      $("modal").classList.remove("show");
      if (_modalResolve) _modalResolve(false);
    });
});
