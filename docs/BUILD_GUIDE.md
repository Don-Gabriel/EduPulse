# Build and run EduPulse on Windows

The prepared workspace is `C:\WorkSpace\Private\Edupulse`. Its Git remote is `https://github.com/Don-Gabriel/EduPulse`. The application runs on this computer; no deployment, hosting account, paid subscription, or API key is required.

## Start the prepared application

1. Double-click `Start-EduPulse.cmd`.
2. The launcher opens `http://127.0.0.1:8765` after checking server health.
3. Choose **Students** for the 70-person class, **Compare students** for a side-by-side view, or one of the four journeys on the overview.
4. Open the profile menu → **Speaker notes** for the twelve-minute script, also available at `/present`.
5. Double-click `Open-Answer-Key.cmd`. Use its **Compact corner view** or **Open small window** button. This separate local file contains all 24 answers; it is not part of the student assessment page.

Keep the terminal-free launcher and private answer sheet within reach. The server continues in the background if the browser is closed. Reopening the launcher reuses a healthy running server rather than starting another copy.

## Reproduce from a fresh checkout

Install Python 3.11 or newer from [python.org](https://www.python.org/downloads/windows/) and Node.js 22.12 or newer from [nodejs.org](https://nodejs.org/en/download). Node 24 is also suitable. Install Git from [git-scm.com](https://git-scm.com/downloads/win) if needed.

Open PowerShell in the directory where you want the repository:

```powershell
git clone https://github.com/Don-Gabriel/EduPulse.git
cd EduPulse
powershell -NoProfile -ExecutionPolicy Bypass -File .\Setup-EduPulse.ps1
.\Start-EduPulse.cmd
```

The execution-policy option applies to that PowerShell invocation. It does not permanently change the computer's policy. The setup script creates `.venv`, installs the pinned Python dependency snapshot, runs `npm ci` using the JavaScript lockfile, and compiles the frontend. Setup needs internet to download open-source packages; subsequent local use does not.

The equivalent manual build is:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock.txt
npm ci --no-audit --no-fund
npm run build
.\.venv\Scripts\python.exe -m pytest tests -q
.\.venv\Scripts\python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port 8765
```

Open the local URL after Uvicorn reports startup complete. If the application is already running, use its launcher rather than starting another server on the same port.

## Understand the implementation in order

| Step | File | What to read or change |
|---|---|---|
| 1 | `data/curriculum.json` | The three concepts, official teaching references, original lessons, 24 questions, answer keys, and explanations. |
| 2 | `backend/app.py` | Database creation and 70-profile seed; concept evidence; support priority; sessions; grading; lessons; reviews; export; optional AI gateway. |
| 3 | `src/main.tsx` | React startup and browser routing context. |
| 4 | `src/App.tsx` | Workspace navigation, student lists, comparison, profiles, lessons, quizzes, insights, reviews, settings, and presenter view. |
| 5 | `src/styles.css` | Navy/teal theme, readable typography, cards, tables, responsive navigation, focus indicators, and print styles. |
| 6 | `src/presentation.ts` | Exact timed spoken script and screen actions. |
| 7 | `tests/test_system.py` | Integration tests, isolated SQLite databases, answer-key checks, duplicate protection, budget blocking, and offline behavior. |
| 8 | `Start-EduPulse.ps1` | Background server process, health polling, logs, and browser opening. |

The complete technology-to-file mapping is in [TECH_STACK.md](TECH_STACK.md).

## The working learning journey

1. A profile reads recent independent evidence for each concept. Empty evidence remains unassessed.
2. The lowest concept estimate selects a reviewed lesson; ties follow curriculum order.
3. Marking the lesson reviewed unlocks guided practice and the independent retest.
4. Practice gives immediate feedback but does not increase the independent evidence estimate.
5. A retest saves each answer once. Feedback remains hidden until all three answers are submitted.
6. Completion updates the plan and the eligible evidence. Browser refresh preserves progress.
7. A result needing further support offers **Request mentor review**. That creates an in-app item with saved evidence. Acknowledgement records that the faculty member saw it.
8. Comparison, profiles, the class map, and CSV export read the same persisted records.

The fixed question bank permits one scored diagnostic and one scored retest per student/concept. Reopening shows the saved result. It does not manufacture new evidence by repeating familiar questions.

## Modify and verify

For frontend development, run `npm run dev` in a second PowerShell window while the backend is running on port 8765. Vite serves the development interface on port 5173 and proxies `/api` requests to FastAPI.

After changes:

```powershell
.\.venv\Scripts\python.exe -m pytest tests -q
npm run build
```

Refresh the browser for frontend changes. Restart the server after backend changes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Stop-EduPulse.ps1
.\Start-EduPulse.cmd
```

The tests use temporary databases rather than your running class records. They make no actual provider requests.

## Local data, recovery, and preparation

- SQLite data: `runtime/edupulse.sqlite3`.
- Server logs: `runtime/server-output.log` and `runtime/server-errors.log`.
- Last preparation backup: `runtime/before-reset.sqlite3`.
- Runtime files, API secrets, and screenshots are ignored by Git.

If you deliberately want the original class again, run `Prepare-Class.ps1` while the server is running and enter its confirmation. It backs up the database before restoring the generated class and keeps API accounting. This action is kept out of the classroom interface.

If startup fails, read the server error log. Confirm port 8765 is not occupied by another service, dependencies were installed in `.venv`, and `dist/index.html` exists. Do not terminate unrelated processes to free the port.

## Optional API later

No key is needed today. If live rephrasing is required later, follow [API_SETUP.md](API_SETUP.md). Only a dedicated verified Free Tier project with billing disabled is permitted. Never attach a payment method, enable paid usage, or rely on token limits as proof of zero billing. Keep the key in the ignored `.env` file and out of chat, browser code, and Git.

The default and currently tested presentation configuration has cloud generation disabled. The provider integration has not been exercised with a real account. The local assessment and lesson workflow is complete independently of it.

## References behind the implementation

- [React documentation](https://react.dev/learn): component and state model.
- [Vite guide](https://vite.dev/guide/): local development and static builds.
- [FastAPI documentation](https://fastapi.tiangolo.com/): request validation and API routes.
- [SQLite documentation](https://www.sqlite.org/docs.html): embedded durable storage.
- [Python control-flow tutorial](https://docs.python.org/3/tutorial/controlflow.html): teaching references.
- [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [billing](https://ai.google.dev/gemini-api/docs/billing), and [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits): optional account constraints.

This prepared classroom uses generated records. It has no production student login or multi-user deployment, and displaying 70 profiles is not evidence of supporting 70 simultaneous users. The presentation guide explains these boundaries and the next steps for a real classroom pilot.
