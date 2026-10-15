# EduPulse

EduPulse is a Windows-local education prototype that connects concept evidence, targeted lessons, independent retesting, and faculty follow-up. It was prepared for Hackathon 2026 by J Don Gabriel, One Man Army.

## Run the demonstration

On the prepared machine, double-click **Start-EduPulse.cmd**. It opens **http://127.0.0.1:8765**. No API key is needed.

The presenter guide is available from the profile menu and at **http://127.0.0.1:8765/present**. Printable notes are in [docs/SPEAKER_NOTES.md](docs/SPEAKER_NOTES.md).

For a fresh Windows checkout, install Python 3.11+ and Node 22.12+ (Node 24 also works), then run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Setup-EduPulse.ps1
.\Start-EduPulse.cmd
```

Setup downloads open-source packages. It does not provision cloud infrastructure, attach billing, buy credits, or call a model API. Existing electricity and internet access are assumed. The application can run offline after setup.

## Features

- Faculty overview with transparent support-priority reasons.
- Seventy generated student profiles in CSE Year 1 across three programming concepts.
- Twenty-four original, checked multiple-choice questions.
- Reviewed local lessons, worked examples, and official Python references.
- Diagnostic, practice, and independent retest journeys.
- Retest feedback withheld until completion; answer keys remain server-side.
- SQLite persistence, idempotent submissions, and bounded independent evidence.
- Two-student comparison, class evidence map, CSV export, in-app mentor review, student search, browser navigation, responsive layouts.
- Demo reset with a local backup; API usage counters are retained.
- Optional guarded Gemini free-tier explanations; disabled by default.
- In-app speaker notes with a twelve-minute story, jury participation, Q&A, and a 60-second version.

## Architecture

React + TypeScript + Vite compile into local static assets. FastAPI serves those assets and the REST endpoints. Python's SQLite module stores student activity. All grading and support scoring are deterministic. The reviewed local content is sufficient for the full workflow.

```text
Browser → local FastAPI → SQLite
                       → reviewed course material and question bank
                       → transparent evidence/priority calculation
                       → optional verified free-tier generation gateway
```

The UI uses custom CSS and Lucide icons. No external fonts, image services, CDNs, vector database, cloud database, Docker, or hosted server are required.

## Demonstration and evidence boundaries

All seeded students, attendance, completion indicators, and baseline assessment observations are synthetic. Baseline records are aggregate demonstration evidence; they are not real learner histories or a predictive training dataset. Live demo responses are stored separately.

The concept evidence estimate is `(correct + 1) / (answered + 2)` over up to eight recent distinct independent items. A practice response never changes this estimate. Empty evidence displays “Not assessed.” Low counts display “Limited evidence.” Support priority uses 70% weakest concept evidence gap, 15% missed-assignment fraction, and 15% absence fraction. Missing engagement signals are excluded and available weights renormalized. These are prototype heuristics, not validated probabilities of mastery or failure.

The fixed bank permits one scored diagnostic and one scored intervention/retest per student and concept. Reopening returns the original assessment rather than presenting known questions as fresh evidence. Reset restores synthetic demonstration data. Further real-world testing requires additional unseen items.

Immediate retest performance is not proof of lasting learning or causal improvement. No 15% mark improvement or 20% error reduction is claimed. The prototype selects a concept-level lesson; it does not infer an exact misconception from arbitrary free text.

The role links are demonstration navigation, not production authentication. The server binds to loopback and checks request origins. Do not expose this prototype publicly or put real student records in it without appropriate authentication, access control, consent, and privacy work.

## Optional AI and zero-spending policy

The default is **no outbound model requests**. An API key is not needed for local lessons, grading, tracking, or retesting.

If organizer permission permits API use, follow [docs/API_SETUP.md](docs/API_SETUP.md). Use only a dedicated Google AI Studio Free Tier project with billing disabled. Never use paid projects, paid credits, trial credits linked to billing, or paid fallback services. A token budget alone cannot guarantee zero charges. Verification of the actual account's billing state is required; the application cannot establish that from the key itself.

The only allowed model is `gemini-3.5-flash-lite`. The gateway caps inputs, outputs, request rate, daily and lifetime token reservations; serializes generation; records unknown/failed outcomes conservatively; performs no automatic retries; and retains reviewed content on failure. Live provider behavior remains unverified until tested against the user's verified free account. Actual quota can be lower than the local limits.

## Development and tests

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port 8765
npm run dev
```

```powershell
.\.venv\Scripts\python.exe -m pytest tests -q
npm run build
```

Runtime state, logs, API keys, test databases, and local screenshots are excluded from Git. Main files: `backend/app.py`, `data/curriculum.json`, `src/App.tsx`, and `src/styles.css`.

## Acknowledgments

Open-source dependencies: React (MIT), Vite (MIT), TypeScript (Apache-2.0), React Router (MIT), Lucide (ISC), FastAPI (MIT), Uvicorn (BSD-3-Clause), HTTPX (BSD-3-Clause), Pydantic (MIT), pytest (MIT), and SQLite (public domain). Retain upstream notices when redistributing dependencies.

Teaching references: [Python control flow tutorial](https://docs.python.org/3/tutorial/controlflow.html), [Python for statement reference](https://docs.python.org/3/reference/compound_stmts.html#the-for-statement). Lesson prose and questions are original explanations based on those references. Code snippets and keyed outputs were checked by execution.

AI-assisted development was used to prepare this prototype. The participant must understand and explain the submitted work and confirm the organizers' permitted use of AI tools. No claim of a newly invented tutoring or statistical algorithm is made.

## Presentation files

- [Exact 12-minute speaker notes](docs/SPEAKER_NOTES.md) — opening situation, multiple students, panel interaction, Q&A.
- [Technology and code-file guide](docs/TECH_STACK.md) — the complete stack and each file’s purpose.
- [Build and operating guide](docs/BUILD_GUIDE.md) — reproducible installation and verification.
- [Private answer sheet](docs/ANSWER_KEY.html) — open with `Open-Answer-Key.cmd`, then use the compact view.

The classroom interface has no presentation labels or reset controls. Prepared data remains documented here as generated, and the presenter should disclose that verbally.
