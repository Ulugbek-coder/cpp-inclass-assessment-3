// =============================================================
// PDF Report Generator
// - Header with course / university info
// - Student info block (Group, First + Last Name, ID, Version)
// - Part 1: MC score summary + 5x6 grid with Correct / Wrong / Not Answered labels
// - Part 2: reference solution vs STUDENT SOLUTION side by side
// - Filename: Group_ID_First_Last.pdf  (e.g. FAR1_250255_Azizbek_Mansurov.pdf)
// =============================================================

function generatePDFReport() {
  const data = window._submissionData;
  if (!data) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentW = pageW - 2 * margin;
  let y = margin;

  // ============================================================
  // Helpers
  // ============================================================
  function checkPage(space) {
    if (y + space > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  }

  // Correctly positions text using a baseline offset so text does NOT
  // draw above the current y (which was causing overlap with filled boxes)
  function addText(text, opts) {
    opts = opts || {};
    const size = opts.size || 10;
    doc.setFont(
      opts.font || "helvetica",
      opts.bold ? "bold" : opts.italic ? "italic" : "normal",
    );
    doc.setFontSize(size);
    doc.setTextColor.apply(doc, opts.color || [0, 0, 0]);
    const lines = doc.splitTextToSize(text, opts.width || contentW);
    const lineH = size * 1.3;
    lines.forEach(function (ln) {
      checkPage(lineH + 2);
      // baseline offset so text starts AT y, not above
      doc.text(ln, opts.x || margin, y + size * 0.85);
      y += lineH;
    });
  }

  function headerBar(text, color) {
    const barH = 24;
    checkPage(barH + 10);
    doc.setFillColor.apply(doc, color);
    doc.rect(margin, y, contentW, barH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(text, margin + 10, y + 16);
    y += barH + 12; // generous gap after bar (was 4 — caused overlap)
    doc.setTextColor(0, 0, 0);
  }

  function spacer(h) {
    y += h;
  }

  // ============================================================
  // 1) TITLE HEADER
  // ============================================================
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, pageW, 84, "F");
  doc.setFillColor(198, 93, 30);
  doc.rect(0, 79, pageW, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PROGRAMMING 1 WITH C++", pageW / 2, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("3rd In-Class Assessment  .  Submission Report", pageW / 2, 48, {
    align: "center",
  });

  doc.setFontSize(8.5);
  doc.text(
    "National Pedagogical University of Uzbekistan (NPUU)  .  School of Exact Sciences  .  Spring 2026",
    pageW / 2,
    64,
    { align: "center" },
  );

  doc.setTextColor(0, 0, 0);
  y = 104;

  // ============================================================
  // 2) STUDENT INFORMATION BLOCK
  // ============================================================
  const infoBoxH = 108;
  doc.setFillColor(251, 247, 238);
  doc.setDrawColor(139, 58, 47);
  doc.setLineWidth(1.5);
  doc.rect(margin, y, contentW, infoBoxH, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(139, 58, 47);
  doc.text("STUDENT INFORMATION  /  TALABA MA'LUMOTI", margin + 12, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const labelX = margin + 12;
  const valueX = margin + 150;

  doc.text("Student Full Name / To'liq Ism:", labelX, y + 38);
  doc.text("Student Group / Guruh:", labelX, y + 54);
  doc.text("Student ID / Talaba ID:", labelX, y + 70);
  doc.text("Exam Version / Versiya:", labelX, y + 86);
  doc.text("Submitted / Yuborildi:", labelX, y + 102);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(data.info.firstName + " " + data.info.lastName, valueX, y + 38);
  doc.text(data.info.group, valueX, y + 54);
  doc.text(data.info.id, valueX, y + 70);
  doc.text("Version " + data.version, valueX, y + 86);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(new Date().toLocaleString(), valueX, y + 102);

  y += infoBoxH + 16;
  doc.setTextColor(0, 0, 0);

  // ============================================================
  // 3) PART 1: MC SCORE SUMMARY
  // ============================================================
  headerBar("PART 1: MULTIPLE CHOICE RESULTS  /  TEST NATIJASI", [30, 58, 95]);

  // ---------- Exam structure info box ----------
  const infoH = 94;
  // Light blue background with navy left accent
  doc.setFillColor(232, 241, 248);
  doc.rect(margin, y, contentW, infoH, "F");
  doc.setFillColor(30, 58, 95);
  doc.rect(margin, y, 5, infoH, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 95);
  doc.text("EXAM STRUCTURE  /  IMTIHON TUZILMASI", margin + 14, y + 16);

  // Intro line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(
    "This exam contains 30 test questions and 2 coding problems.",
    margin + 14,
    y + 30,
  );
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80, 80, 80);
  doc.text(
    "Bu imtihon 30 ta test savoli va 2 ta kodlash masalasidan iborat.",
    margin + 14,
    y + 42,
  );

  // Three little inline columns showing the points breakdown
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 58, 95);
  doc.text("30 tests  x  2 pts", margin + 14, y + 62);
  doc.text("=", margin + 130, y + 62);
  doc.setTextColor(45, 122, 58);
  doc.text("60 points", margin + 144, y + 62);

  doc.setTextColor(30, 58, 95);
  doc.text("2 coding  x  20 pts", margin + 220, y + 62);
  doc.text("=", margin + 336, y + 62);
  doc.setTextColor(45, 122, 58);
  doc.text("40 points", margin + 350, y + 62);

  // Total line
  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.8);
  doc.line(margin + 14, y + 72, margin + contentW - 14, y + 72);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(139, 58, 47);
  doc.text("MAXIMUM TOTAL  /  JAMI MAKSIMUM", margin + 14, y + 86);
  doc.setTextColor(45, 122, 58);
  doc.text("100 points", margin + contentW - 14, y + 86, { align: "right" });

  doc.setTextColor(0, 0, 0);
  y += infoH + 14;

  // Score summary box (two stacked summary blocks instead of side-by-side
  // so the numbers don't get cut/overlapped)
  const scoreBoxH = 64;
  doc.setFillColor(251, 247, 238);
  doc.setDrawColor(139, 58, 47);
  doc.setLineWidth(1.2);
  doc.rect(margin, y, contentW, scoreBoxH, "FD");

  const halfW = contentW / 2;

  // Left half: score /60
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(139, 58, 47);
  doc.text("SCORE  /  BALL", margin + 16, y + 20);

  doc.setFontSize(26);
  doc.text(String(data.mcScore), margin + 16, y + 48);
  const scoreStrW = doc.getTextWidth(String(data.mcScore));
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(" / 60 points", margin + 16 + scoreStrW + 4, y + 48);

  // Divider
  doc.setDrawColor(220, 210, 190);
  doc.setLineWidth(0.5);
  doc.line(margin + halfW, y + 10, margin + halfW, y + scoreBoxH - 10);

  // Right half: correct count /30
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(45, 122, 58);
  doc.text("CORRECT ANSWERS  /  TO'G'RI JAVOBLAR", margin + halfW + 16, y + 20);

  doc.setFontSize(26);
  doc.text(String(data.correct), margin + halfW + 16, y + 48);
  const corrStrW = doc.getTextWidth(String(data.correct));
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(" / 30 questions", margin + halfW + 16 + corrStrW + 4, y + 48);

  doc.setTextColor(0, 0, 0);
  y += scoreBoxH + 14;

  // Tab switch flag (no Unicode symbols — plain text only)
  if (data.tabSwitches > 0) {
    const flagH = 26;
    doc.setFillColor(251, 233, 231);
    doc.setDrawColor(179, 38, 30);
    doc.setLineWidth(1.2);
    doc.rect(margin, y, contentW, flagH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(179, 38, 30);
    const msg =
      "FLAGGED: Tab was switched " +
      data.tabSwitches +
      " time" +
      (data.tabSwitches > 1 ? "s" : "") +
      " during the exam.";
    doc.text(msg, margin + 12, y + 17);
    doc.setTextColor(0, 0, 0);
    y += flagH + 14;
  } else {
    y += 4;
  }

  // ============================================================
  // 4) ANSWER BREAKDOWN TABLE (5 cols x 6 rows = 30 cells)
  // ============================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text("Answer Breakdown  /  Javoblar Jadvali", margin, y + 10);
  y += 20;

  const cols = 5;
  const rows = Math.ceil(data.mcQuestions.length / cols);
  const cellW = contentW / cols;
  const cellH = 42;

  doc.setTextColor(0, 0, 0);
  const gridTop = y;

  for (let i = 0; i < data.mcQuestions.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cx = margin + col * cellW;
    const cy = gridTop + row * cellH;

    const userAns = data.userAnswers[i];
    const q = data.mcQuestions[i];
    const isAnswered = userAns !== -1;
    const isCorrect = isAnswered && userAns === q.correct;

    // Cell background
    if (!isAnswered) {
      doc.setFillColor(240, 240, 240);
    } else if (isCorrect) {
      doc.setFillColor(232, 243, 234);
    } else {
      doc.setFillColor(251, 233, 231);
    }
    doc.rect(cx, cy, cellW, cellH, "F");

    // Cell border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(cx, cy, cellW, cellH, "S");

    // Question number (top-left)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Q" + (i + 1), cx + 8, cy + 15);

    // Status label (bottom) — text labels, not Unicode symbols
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    let label, r, g, b;
    if (!isAnswered) {
      label = "Not Answered";
      r = 140;
      g = 140;
      b = 140;
    } else if (isCorrect) {
      label = "Correct";
      r = 45;
      g = 122;
      b = 58;
    } else {
      label = "Wrong";
      r = 179;
      g = 38;
      b = 30;
    }
    doc.setTextColor(r, g, b);
    doc.text(label, cx + cellW / 2, cy + 32, { align: "center" });
  }

  y = gridTop + rows * cellH + 16;
  doc.setTextColor(0, 0, 0);

  // Legend
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Correct = +2 pts      |      Wrong = 0 pts      |      Not Answered = 0 pts",
    margin,
    y + 8,
  );
  y += 20;
  doc.setTextColor(0, 0, 0);

  // ============================================================
  // 5) PART 2: CODING SUBMISSIONS (SIDE-BY-SIDE)
  // ============================================================
  doc.addPage();
  y = margin;
  headerBar(
    "PART 2: CODING SUBMISSIONS  /  KODLASH TOPSHIRUVLARI",
    [198, 93, 30],
  );

  // Updated intro text as requested by user
  addText(
    "Reference code solution and student's submitted code solution for each problem.",
    { size: 10, color: [70, 70, 70] },
  );
  addText(
    "Har bir masala uchun to'g'ri kod yechimi va talabaning har bir masala uchun yozgan kod yechimi.",
    { size: 9.5, color: [110, 110, 110], italic: true },
  );
  y += 10;

  // Each coding problem: title + side-by-side code panels
  const solutions = window.SOLUTIONS[data.version];

  for (let i = 0; i < 2; i++) {
    checkPage(50);

    // Problem title (bilingual)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text(
      "Coding Problem " + (i + 1) + "  /  " + (i + 1) + "-Kodlash Masalasi",
      margin,
      y + 10,
    );
    y += 24;

    const colGap = 12;
    const colW = (contentW - colGap) / 2;

    // Column headers
    const headerH = 22;
    // Left: reference solution
    doc.setFillColor(198, 93, 30);
    doc.rect(margin, y, colW, headerH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("CORRECT SOLUTION  /  TO'G'RI YECHIM", margin + 8, y + 15);

    // Right: STUDENT SOLUTION (renamed from "Your Solution")
    doc.setFillColor(30, 58, 95);
    doc.rect(margin + colW + colGap, y, colW, headerH, "F");
    doc.text(
      "STUDENT SOLUTION  /  TALABA YECHIMI",
      margin + colW + colGap + 8,
      y + 15,
    );

    doc.setTextColor(0, 0, 0);
    y += headerH;

    // Code bodies
    const correctCode = solutions[i] || "(No reference solution)";
    const studentCode =
      (i === 0 ? data.code1 : data.code2) || "(No code submitted)";

    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    const correctLines = doc.splitTextToSize(correctCode, colW - 14);
    const studentLines = doc.splitTextToSize(studentCode, colW - 14);
    const maxLines = Math.max(correctLines.length, studentLines.length);
    const lineHeight = 10;
    const boxH = Math.max(80, maxLines * lineHeight + 14);

    // If box overflows page, move to new page with repeated column headers
    if (y + boxH > pageH - margin) {
      doc.addPage();
      y = margin;
      doc.setFillColor(198, 93, 30);
      doc.rect(margin, y, colW, headerH, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("CORRECT SOLUTION (cont.)", margin + 8, y + 15);

      doc.setFillColor(30, 58, 95);
      doc.rect(margin + colW + colGap, y, colW, headerH, "F");
      doc.text("STUDENT SOLUTION (cont.)", margin + colW + colGap + 8, y + 15);

      doc.setTextColor(0, 0, 0);
      y += headerH;
    }

    // Left column background — light orange
    doc.setFillColor(255, 244, 230);
    doc.setDrawColor(198, 93, 30);
    doc.setLineWidth(0.8);
    doc.rect(margin, y, colW, boxH, "FD");

    // Right column background — light blue
    doc.setFillColor(232, 241, 248);
    doc.setDrawColor(30, 58, 95);
    doc.rect(margin + colW + colGap, y, colW, boxH, "FD");

    // Code text
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 30, 30);

    const textStartY = y + 10;
    function renderLines(lines, startX) {
      lines.forEach(function (ln, idx) {
        const ly = textStartY + idx * lineHeight;
        if (ly > y + boxH - 6) return;
        const maxLen = 62;
        let toPrint = ln;
        if (ln.length > maxLen) toPrint = ln.substring(0, maxLen - 2) + "..";
        doc.text(toPrint, startX + 6, ly);
      });
    }

    renderLines(correctLines, margin);
    renderLines(studentLines, margin + colW + colGap);

    y += boxH + 20;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
  }

  // ============================================================
  // 5.5) INSTRUCTOR GRADING SECTION (editable AcroForm fields)
  // ============================================================
  // Always give this section its own page to avoid overflow mishaps
  doc.addPage();
  y = margin;
  headerBar(
    "INSTRUCTOR GRADING SECTION  /  O'QITUVCHI BAHOLASH HUDUDI",
    [45, 122, 58],
  );

  // ---------- Prominent red warning banner for students ----------
  const warnH = 94;
  // Dark red solid background, thick white border
  doc.setFillColor(179, 38, 30);
  doc.rect(margin, y, contentW, warnH, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2);
  doc.rect(margin + 3, y + 3, contentW - 6, warnH - 6, "S");

  // Circular "!" icon (white circle with red !)
  const cx = margin + 28;
  const cy = y + warnH / 2;
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(179, 38, 30);
  doc.text("!", cx, cy + 8, { align: "center" });

  // Warning text (right of circle)
  const tx = margin + 56;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("FOR INSTRUCTOR USE ONLY  /  FAQAT O'QITUVCHI UCHUN", tx, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    "Students MUST NOT edit this section. Any student edits here will result in a total grade",
    tx,
    y + 40,
  );
  doc.text("of ZERO (0 points) for the entire exam.", tx, y + 52);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text(
    "Talabalar bu qismni tahrirlamasligi SHART. Bu qismga talaba tomonidan kiritilgan har qanday",
    tx,
    y + 68,
  );
  doc.text(
    "o'zgarish butun imtihon uchun NOL (0 ball) bilan natijalanadi.",
    tx,
    y + 80,
  );

  doc.setTextColor(0, 0, 0);
  y += warnH + 14;

  // Note about editability
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(
    "Instructor: open this PDF in Preview (Mac) or Adobe Reader and type directly into the boxes below.",
    margin,
    y + 10,
  );
  doc.text("Save the PDF afterwards to preserve your grading.", margin, y + 22);
  y += 38;

  // Helper to create a labeled text field
  function addFormField(
    label,
    labelUz,
    x,
    yTop,
    w,
    h,
    fieldName,
    defaultVal,
    multiline,
  ) {
    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 95);
    doc.text(label, x, yTop + 10);
    if (labelUz) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(labelUz, x, yTop + 22);
    }
    // Field box (drawn visually so it looks nice even without Acro support)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(45, 122, 58);
    doc.setLineWidth(1);
    const boxY = yTop + (labelUz ? 28 : 18);
    doc.rect(x, boxY, w, h, "FD");

    // Actual interactive AcroForm field
    try {
      const tf = new window.jspdf.AcroFormTextField();
      tf.Rect = [x, boxY, w, h];
      tf.fieldName = fieldName;
      tf.fontSize = multiline ? 9 : 11;
      tf.value = defaultVal || "";
      if (multiline) tf.multiline = true;
      tf.maxFontSize = 14;
      doc.addField(tf);
    } catch (e) {
      // If AcroForm API is unavailable for any reason, the visible box still shows
      console.warn("AcroForm field creation failed:", e);
    }
    return boxY + h;
  }

  // Layout:
  //   Row 1: Problem 1 score | Problem 2 score  (two side-by-side small fields)
  //   Row 2: Comments (wide multiline field)
  //   Row 3: Summary — MC shown (read-only text), Total coding (field), Final grade (field)
  //   Row 4: Graded by (field) | Date (field)
  doc.setTextColor(0, 0, 0);

  // Row 1: two score boxes
  const col1X = margin;
  const col2X = margin + contentW / 2 + 8;
  const halfColW = contentW / 2 - 8;
  const smallH = 28;

  let bottomY;
  bottomY = addFormField(
    "Coding Problem 1 score (out of 20)",
    "1-Kodlash masalasi ballari (20 dan)",
    col1X,
    y,
    halfColW,
    smallH,
    "coding1_score",
    "",
    false,
  );
  addFormField(
    "Coding Problem 2 score (out of 20)",
    "2-Kodlash masalasi ballari (20 dan)",
    col2X,
    y,
    halfColW,
    smallH,
    "coding2_score",
    "",
    false,
  );
  y = bottomY + 14;

  // Row 2: Comments
  const commentsH = 80;
  bottomY = addFormField(
    "Comments / Feedback",
    "Izohlar / Mulohaza",
    margin,
    y,
    contentW,
    commentsH,
    "comments",
    "",
    true,
  );
  y = bottomY + 14;

  // Row 3: Summary row
  // Left side — pre-filled MC score (not editable, shown as text with box)
  const thirdW = (contentW - 20) / 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 95);
  doc.text("MC score (auto-filled)", margin, y + 10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Test ballari (avto)", margin, y + 22);

  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(180, 180, 180);
  doc.rect(margin, y + 28, thirdW, smallH, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text(
    String(data.mcScore) + " / 60",
    margin + 10,
    y + 28 + smallH / 2 + 5,
  );

  // Middle — Total coding score (editable)
  addFormField(
    "Total coding score (out of 40)",
    "Jami kodlash ballari (40 dan)",
    margin + thirdW + 10,
    y,
    thirdW,
    smallH,
    "total_coding",
    "",
    false,
  );

  // Right — Final grade (editable)
  addFormField(
    "FINAL GRADE (out of 100)",
    "YAKUNIY BAHO (100 dan)",
    margin + 2 * thirdW + 20,
    y,
    thirdW,
    smallH,
    "final_grade",
    "",
    false,
  );

  y += smallH + 42;

  // Row 4: Graded by + Date
  addFormField(
    "Graded by",
    "Baholagan",
    col1X,
    y,
    halfColW,
    smallH,
    "graded_by",
    "",
    false,
  );
  addFormField(
    "Date",
    "Sana",
    col2X,
    y,
    halfColW,
    smallH,
    "graded_date",
    "",
    false,
  );
  y += smallH + 42;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // ============================================================
  // 6) FOOTER + PAGE NUMBERS
  // ============================================================
  y = Math.max(y, pageH - margin - 40);
  checkPage(30);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 12;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This PDF is an official submission report. Upload it via the Google Form provided by your instructor.",
    pageW / 2,
    y,
    { align: "center" },
  );
  y += 10;
  doc.text(
    "Bu PDF rasmiy topshiruv hisoboti. Uni o'qituvchi bergan Google Forma orqali yuklang.",
    pageW / 2,
    y,
    { align: "center" },
  );

  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Page " + i + " of " + pages, pageW - margin, pageH - 16, {
      align: "right",
    });
  }

  // ============================================================
  // 7) SAVE — new filename format: Group_ID_First_Last.pdf
  // ============================================================
  function sanitize(s) {
    return (s || "").replace(/[^a-zA-Z0-9]/g, "");
  }
  const fileName =
    sanitize(data.info.group) +
    "_" +
    sanitize(data.info.id) +
    "_" +
    sanitize(data.info.firstName) +
    "_" +
    sanitize(data.info.lastName) +
    ".pdf";
  doc.save(fileName);
}

// Expose for "Re-download PDF" button
window.downloadPDF = generatePDFReport;
