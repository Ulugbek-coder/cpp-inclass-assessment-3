# C++ Homework Assignment — NPUU

Browser-based in-class assessment for Programming 1 with C++ at the National Pedagogical University of Uzbekistan.

## Features

- 4 exam versions (A/B/C/D) with unique coding problems
- 25 randomized multiple-choice questions from a bank of 60
- 2 coding problems per version (different per version)
- 80-minute countdown timer with auto-submit
- Bilingual (English + Uzbek) for all questions, options, and instructions
- Anti-cheating: right-click, copy-paste, and DevTools shortcuts disabled; tab-switch detection
- Auto-generated PDF report with student info, score summary, answer table (check/cross), and side-by-side correct vs student code
- Submission via Google Form (configurable)

## Structure

```
cpp-homework/
├── index.html              - Welcome / version selection / student info form
├── exam.html               - Exam page (reads ?v=A|B|C|D from URL)
├── css/styles.css          - All shared styles
├── js/
│   ├── app.js              - Exam logic, timer, anti-cheat, submission
│   ├── pdf-generator.js    - PDF report generation
│   └── questions/
│       ├── question-bank.js - 60 bilingual MC questions
│       ├── solutions.js    - Reference solutions for coding problems
│       └── version-[a-d].js - Per-version coding problems + shuffle seeds
└── assets/                 - (optional assets folder)
```

## Deployment

See the `Deployment_Guide.pdf` (delivered separately) for step-by-step Google Form + GitHub + Vercel setup.

The only file you need to edit before deploying is `exam.html` — find `GOOGLE_FORM_LINK_HERE` and replace with your Google Form URL.
