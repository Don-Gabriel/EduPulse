# EduPulse technology and implementation guide

EduPulse is a Windows-local prototype for a CSE Year One class configured with 70 generated student profiles. The implemented route connects concept evidence, a reviewed lesson, practice, a separate retest, persistent progress, and faculty follow-up. The core application runs without cloud services or API keys.

## Technology choices

| Technology | Main files | Purpose and reason |
|---|---|---|
| React 19 | `src/App.tsx`, `src/main.tsx` | Interactive faculty workspace, profiles, lessons, assessments, and settings. Updates the screen from saved server responses. |
| TypeScript | `src/App.tsx`, `src/presentation.ts`, `tsconfig.json` | Types application data and catches build-time integration errors. |
| Vite | `vite.config.ts`, `package.json` | Development tooling and production asset build. In development, proxies API requests to the local backend. |
| React Router | `src/App.tsx` | Named routes, links, browser history, and direct navigation between workspace screens. |
| CSS | `src/styles.css` | Professional visual theme, responsive layout, typography, focus states, and presentation styling. No paid design kit is required. |
| Lucide React | `src/App.tsx` | Consistent navigation and action icons bundled with the application. |
| Python | `backend/app.py` | Assessment rules, evidence calculations, persistence, optional generation safeguards, and exports. |
| FastAPI | `backend/app.py` | Local HTTP API, routing, validation integration, and built frontend delivery. |
| Pydantic | `backend/app.py` | Validates request fields, answer ranges, and the structure of optional generated explanations. |
| Uvicorn | `Start-EduPulse.ps1` | Runs FastAPI bound to `127.0.0.1:8765`. |
| SQLite | `backend/app.py`; database in `runtime/` | Stores students, attempts, sessions, learning plans, mentor reviews, and the AI usage ledger on disk. |
| Original reviewed curriculum | `data/curriculum.json` | Three Python concepts, 24 original MCQs, answer keys, explanations, and official Python reference links. |
| Optional Gemini via HTTPX | `backend/app.py`, `.env.example` | Rephrases approved lesson content when explicitly configured. Currently disabled; not required for the learning loop. |
| pytest and FastAPI TestClient | `tests/test_system.py` | Isolated API and persistence checks without making provider requests. |
| Windows PowerShell and CMD | `Start-EduPulse.cmd`, `Start-EduPulse.ps1`, `Stop-EduPulse.ps1`, `Setup-EduPulse.ps1` | Setup, health-checked startup, browser opening, local logging, and stopping the server. |
| Node.js and npm | `package.json`, `package-lock.json` | Install frontend packages and run TypeScript/Vite builds. Node is needed for setup and development; the built application is served by Python. |
| Prettier | `package.json` | Development-only source formatting so the components and styles are easier to inspect. It is not an application service. |
| Git and GitHub | `.gitignore`, repository history | Version control and a source backup in the requested repository. GitHub does not host this running application. |

The frontend uses ordinary CSS rather than Tailwind or shadcn/ui. This implementation does not include XGBoost, FAISS, embedding models, a trained risk model, or a cloud database. The exact installed frontend versions are captured in `package-lock.json`; Python dependencies are declared in `requirements.txt` and the dependency snapshot is in `requirements.lock.txt`.

## What happens when an answer is submitted

1. The browser loads the workspace from `GET /api/bootstrap` and opens the selected student's profile.
2. `POST /api/interventions` creates or retrieves the student's learning plan for a concept.
3. The learner reviews the lesson. `POST /api/interventions/{id}/read` records that the lesson has been reviewed.
4. `POST /api/sessions` opens the appropriate diagnostic, practice, or retest session. Existing scored sessions are reused to prevent repeated scoring.
5. `POST /api/sessions/{id}/answers` submits a question ID and a selected option. The server validates the request and checks the private reviewed answer key.
6. SQLite records the answer. A unique session/question constraint and transaction prevent duplicate submissions from creating extra records.
7. During a retest, correctness and explanations remain hidden until completion. Practice feedback is available during practice.
8. The completed assessment updates its associated plan. The profile and overview read the resulting saved state.
9. Faculty inspect the evidence or mentor-review queue. Acknowledging a review records that it has been seen; it does not send a message or mark the difficulty resolved.

The browser does not decide correctness. The answer key is not returned with unanswered assessment questions.

## Evidence and priority

**Concept evidence estimate**

`100 × (correct + 1) / (answered + 2)`

The estimate uses up to eight recent eligible distinct observations. Practice is excluded. An unfinished retest does not leak correctness through the profile or activity feed. No observations produce **Not assessed**; fewer than three observations produce **Limited evidence**.

This is a transparent heuristic, not a validated probability of mastery. The assessment percentage and evidence estimate are deliberately different: Asha's first three correct retest answers can produce a 3/3 retest result while changing her smoothed recent-evidence estimate from 20% to 40%.

**Support priority**

- Concept evidence gap: 70%.
- Assignment completion gap: 15%.
- Attendance gap: 15%.

Available components are normalized when signals are missing. Without concept evidence, the next action is assessment rather than an invented learning-risk score. These weights are prototype choices; they have not been learned from outcomes or validated as failure-prediction coefficients.

When concept estimates tie, the current course order determines the first recommendation. Rahul's initial off-by-one and nested-loop estimates tie; off-by-one is selected first. The system does not claim to infer a precise misconception from a wrong answer option.

## Curriculum and adaptation

The course covers loop boundaries, off-by-one errors, and nested-loop execution. Each concept has two diagnostic questions, three practice questions, and three separate retest questions. The fixed retest bank is distinct from the practice bank. Repeating a known question is not treated as fresh evidence.

The lesson is selected by an explicit concept identifier. This is local content selection, not embedding-based retrieval. Official Python references support the language semantics:

- [Python tutorial on range](https://docs.python.org/3/tutorial/controlflow.html#the-range-function).
- [Python reference for the for statement](https://docs.python.org/3/reference/compound_stmts.html#the-for-statement).

All 24 original question snippets and the three lesson examples were executed locally and checked against their stored outputs. The integration suite includes a question-key verification check.

## Optional generation and zero spending

The default configuration makes no model-provider calls. No API key is needed to present the core application.

Optional generation requires a supplied key, the configured supported model, and an explicit operator flag confirming a dedicated Free Tier project with billing disabled. A key or an environment flag cannot independently prove billing status; the operator must verify the account before enabling generation.

The configured application ceilings are:

| Control | Ceiling |
|---|---:|
| Concurrent generation | 1 |
| Generation calls per minute | 2 |
| Generation calls per rolling 24 hours | 20 |
| Input per request | 2,000 tokens |
| Output allowance per request | 800 tokens |
| Daily tokens used or reserved | 50,000 |
| Lifetime tokens used or reserved | 100,000 |
| Automatic retries | 0 |
| Paid fallback | None |

Provider limits may be lower. Usage reservations are persistent; unknown usage from unsuccessful calls is retained conservatively. Reviewed local content remains available when a request is disabled, blocked, or unsuccessful. The usage ledger is preserved when the private preparation reset is used.

The optional model only rephrases approved teaching content. It does not grade answers or calculate support priority. Structure and source identifiers are validated, but valid structured output alone is not a guarantee of factual accuracy.

See `docs/API_SETUP.md` for setup only if optional generation is needed later. Do not enable cloud generation during the panel presentation.

## Startup and local files

Double-click `Start-EduPulse.cmd`. The PowerShell launcher checks for a built frontend and Python dependencies, starts Uvicorn in the background, waits for the health endpoint, and opens the workspace at `http://127.0.0.1:8765`.

The server serves the frontend build from `dist/`. Runtime state, logs, and the database remain in `runtime/`. A browser refresh does not delete assessment progress. The application is bound to localhost; it is not published to the internet.

For a development build, use the project's installed dependencies and run:

```powershell
npm run build
python -m pytest tests/test_system.py -q
```

Use the project's Python environment when installed, for example `.venv\Scripts\python.exe -m pytest tests/test_system.py -q`. The build command checks TypeScript and produces static assets. The test suite uses temporary databases and disables provider calls.

## Verification and limits

The current automated suite covers startup data, unanswered answer-key privacy, a full persisted learning loop, practice exclusion, hidden retest feedback, duplicate protection, input validation, failed retests, disabled-cloud behavior, usage-budget blocking, preservation of the ledger, local origin restrictions, CSV export, mentor acknowledgment, and question-key correctness.

A test file describes coverage; a passing result must come from the latest actual run. After changes to the class size or navigation, rerun the suite and build, then inspect the browser workflow. Before presenting, verify:

- The overview and student list show 70 CSE Year One profiles.
- Asha's complete route saves results and updates her profile.
- Rahul's lesson differs from Asha's.
- Ishaan is unassessed until answers are submitted.
- Omar's existing mentor review can be inspected and acknowledged.
- Navigation, browser back, refresh, and export behave as expected.
- The core route remains usable without internet.
- No cloud generation is enabled or required.
- Text is legible at the actual projector resolution.

This is a local faculty-operated prototype with generated records. It does not yet provide production authentication, separate student accounts, institutional authorization, a shared multi-user deployment, or evidence of improved real-world learning outcomes. It has not been load-tested for seventy simultaneous users merely because it displays seventy profiles.

The next production steps are faculty content review, consented data handling, authentication and authorization, appropriate hosting and database choices, operational monitoring, accessibility and security review, and a classroom evaluation with delayed retesting.


## Presenter-only files

- `src/presentation.ts`: exact twelve-minute script used by the private `/present` route.
- `docs/SPEAKER_NOTES.md`: matching spoken script, actions, panel Q&A, answer keys, and time-saving options.
- `docs/ANSWER_KEY.html`: standalone private answer reference with a compact corner view. It is outside `dist/` and is not served to student assessment routes.
- `Open-Answer-Key.cmd`: opens that local reference in a separate browser window or tab.
- `Prepare-Class.ps1`: optional private preparation utility. Requires typing its confirmation; backs up activity and restores 70 generated profiles without clearing the API ledger. It is not in the classroom interface.

`/compare` is an ordinary classroom route for comparing any two students. It reads the same saved evidence as their profiles. It does not create or alter responses.
