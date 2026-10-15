# EduPulse twelve minute panel presentation

This script presents a Year One CSE class of 70 students through four different support needs. Target **12 minutes**, leaving about **3 minutes for questions** in a 15-minute slot. The script contains approximately 1,086 spoken words; the remaining time is for navigation, reading code, and panel participation. Speak at a relaxed pace and rehearse once with a timer. The words under “Say” are spoken; screen directions and the answer key are private.

## Private preparation checklist

- Before beginning, disclose once: **“For this presentation I am using generated student records. The answers we submit now will be saved by the running system.”** Classroom screens need not repeat that disclosure.
- The opening is a hypothetical classroom situation. Do not present it as an incident that actually happened to you.
- Open the application with `Start-EduPulse.cmd`. Keep the overview projected; keep these notes on another device or an unprojected window.
- Check that the class count is 70 and that Asha, Rahul, Ishaan, and Omar are searchable. The private rehearsal state should leave Asha's nested-loop estimate at 20%, Ishaan unassessed, and Omar's review available. Do not reset data during the panel presentation.
- Keep live generation off. No API key is required. Do not upgrade an account, add billing, or buy credits.
- Confirm the event's permission for AI-assisted development and APIs. Explain the libraries and assistance used honestly.
- Use one complete Asha journey. For Rahul, show the distinct lesson; for Ishaan, show the unassessed state; for Omar, show mentor review. There is no need to complete four assessments.
- Never rehearse answers on the same prepared presentation state immediately before presenting. Completed assessments reopen as results to prevent repeated scoring. Use a separately prepared rehearsal state or have the original class restored before the slot.
- Avoid changing browser zoom mid-presentation. Check the projected text from the back of the room and close unrelated tabs.
- If you have already changed one student's records, describe the values on screen. The script's expected values depend on a fresh baseline.

## Exact speaker notes

### 0:00–1:00 A simple classroom situation

**Say:**

“Good morning. Imagine a first-year Computer Science class with seventy students. The teacher finishes a lesson on loops and asks, “Is everyone clear?” A few students say yes. Some stay quiet. The class moves on. A week later, an assessment shows that several students were struggling with different parts of the lesson. Now the teacher has to work backwards: who needs help, what exactly is confusing them, and what should happen next? I used that simple, hypothetical classroom situation as my starting point. And that is how I came up with this idea: EduPulse, a system that helps faculty turn a learning gap into a clear next action.”

**On screen:** Start on the faculty overview. Keep the cursor still during the opening story. This is an imagined situation, not a claim about a personal classroom incident.

### 1:00–1:50 Introduce the class

**Say:**

“This is the workspace for CSE, Year One. We can move from the whole class to one student, inspect a concept, open a learning plan, and return to see what changed. The important point is that seventy students do not need seventy copies of the same advice. Today I will show four situations: Asha needs help with nested loops; Rahul needs a different starting point; Ishaan has no assessment evidence yet; and Omar needs a mentor conversation. Together, they show how the same system can support different decisions.”

**On screen:** Show the 70-student count. Open Students and briefly point to search and the support filters. Do not scroll through the entire class.

### 1:50–3:00 Let the panel choose the evidence

**Say:**

“Let us begin with Asha. Before I open her learning plan, may I ask you one question? If a student attends most classes and submits most assignments, is that enough to decide which topic she understands? I would still want to see her answers. Here, attendance and assignment completion provide context, while the concept scores show where to investigate. Asha's clearest gap is nested loops. The support priority also shows its ingredients, so a teacher can inspect the reasoning. It is a transparent prioritization rule. The purpose is to direct attention toward useful evidence and a practical next step.”

**On screen:** Search Asha and open her profile. Pause 10–15 seconds for one panel response. Show all three concept bars and the priority breakdown. Do not imply that generated baseline records contain inspectable historical question text.

### 3:00–4:05 Give the right lesson

**Say:**

“I will open Asha's learning plan. The lesson concentrates on one idea: each outer-loop iteration starts another complete run of the inner loop. The explanation is broken into small steps, followed by a worked example. The teaching reference is visible, and the practice questions give feedback. That gives the student a way to work on the gap before taking another check. In the current configuration, these are reviewed local lessons. Optional Gemini generation can rephrase approved material, but it is switched off today. The useful workflow still works. I am moving through this lesson quickly to show the system; a real learner would take the time they need.”

**On screen:** Click Open learning plan for nested loops. Show the lesson steps, code example, and source reference. Mark the lesson reviewed. Briefly point to Practice with feedback, then choose the independent retest.

### 4:05–6:05 Ask the panel to take part

**Say:**

“Now we check what the learner can do with different questions. Would one of you choose the first answer? There are three outer iterations and four inner iterations. How many times does the inner statement run? Please choose the option you would submit. I will enter the answer you choose. The response is saved, and feedback stays hidden until the check is complete so it does not teach the remaining answers. I will finish the other two questions to show the full journey. Notice that submitting an answer changes real saved state; this is not a slide animation.”

**On screen:** Allow up to 30 seconds for the first response; submit it honestly. Complete the other two items without reading this private answer key aloud. Click See my results. This section includes about 75 seconds of reading, clicking, and panel participation.

### 6:05–7:05 Show what actually changed

**Say:**

“Here is the result from the answers we just submitted. Let us return to the learning plan and then the student profile. The current estimate uses the recent response history, so it is different from the percentage correct in this single check. A good immediate result is useful evidence, but it does not establish long-term retention. A later assessment would be needed for that. What we can demonstrate now is the completed loop: a gap led to a lesson, the lesson led to a check, and the check produced a saved result that faculty can use.”

**On screen:** Read the actual correct count. If all three were correct from a fresh Asha baseline, point to 20% before and 40% current; explain that 3/3 is the retest result while 40% is the smoothed recent-evidence estimate. If any were wrong, say: “This result tells us that more support is needed.” Never claim a predetermined improvement.

### 7:05–8:05 Show a different student need

**Say:**

“Now let us look at Rahul. His profile does not look like Asha's. His off-by-one and nested-loop estimates are tied at the low end; the system selects off-by-one first in the course order. An off-by-one problem means a loop may run once too few or once too many. His focused lesson therefore checks the intended first and last values, rather than repeating Asha's nested-loop explanation. This is the practical meaning of targeting support at a concept. The teacher can inspect the other concepts too, and choose a different starting point when their classroom knowledge suggests one.”

**On screen:** Open Compare students to show Asha and Rahul side by side. Then open Rahul’s profile and his off-by-one plan to show its distinct lesson. Do not complete another retest. If the profile has changed during rehearsal, describe the displayed recommendation instead.

### 8:05–9:00 Handle missing evidence honestly

**Say:**

“Ishaan is a third situation. We do not yet have answers from him. The system therefore shows that he has not been assessed. It does not assign him a zero or declare that he needs urgent support simply because data is missing. His next step is a short diagnostic. After those first answers, the evidence remains limited; two responses are only a starting point. That distinction matters in a real class: a missing record and a demonstrated learning gap should lead to different conversations. Here, the teacher can see which situation they are dealing with.”

**On screen:** Search Ishaan. Point to Not assessed and missing engagement values. Open Start diagnostic and show the first question; submission is optional. If submitted, retain the Limited evidence label in the explanation. Allow 10 seconds for the panel to inspect the contrast.

### 9:00–10:00 Bring a mentor into the loop

**Say:**

“Finally, there is Omar. Some difficulties need a conversation with a person. The mentor-review area makes that next action visible, with the student's name, concept, and reason for review. A teacher can open the evidence and acknowledge the item. Acknowledging means it has been seen; it does not mean the learning difficulty has disappeared. It also does not send a message or email. This is the faculty workflow that connects the learning activity to follow-up. EduPulse keeps the teacher involved in deciding what kind of support the student needs.”

**On screen:** Open Mentor review. Show Omar's existing review and its reason. Open his evidence, then return and acknowledge if the item is still open. If already acknowledged from rehearsal, use All reviews. Explain this as a prepared case, not a newly triggered review.

### 10:00–11:15 Explain how it works

**Say:**

“The interface uses React and TypeScript, with Vite for the build, React Router for navigation, CSS for the visual design, and Lucide icons. Python and FastAPI handle the requests, and SQLite stores progress on this Windows machine. When I submit an option, the server checks a reviewed answer key, records the response, recalculates eligible evidence, and returns the updated view. Grading and prioritization are reproducible. I am not claiming a trained failure-prediction model. The optional Gemini connection only changes explanations; it does not decide whether an answer is right. Cloud generation is currently off, so this presentation needs no API key, paid hosting, or cloud database. The local learning flow also continues without internet.”

**On screen:** Open Workspace settings to show local storage and disabled cloud generation, then return to the overview. Keep the technical explanation at this level unless the panel requests code. Do not enable an API during the presentation.

### 11:15–12:00 Close with the next step

**Say:**

“The result is a working connection between a class view and a student's next step. Asha receives focused support, Rahul gets a different lesson, Ishaan begins with assessment, and Omar stays connected to a mentor. My next step would be a supervised classroom pilot: review the teaching content with faculty, use consented records, and measure delayed learning as well as immediate answers. The question I want EduPulse to help a teacher answer is simple: who needs help with what, and what should we do next? Thank you. I would be happy to take your questions.”

**On screen:** End on the overview. Stop at 12 minutes and keep the remaining approximately 3 minutes of the 15-minute slot for questions.

## Private answer key

Do not project this section or read the option letters as if they were the panel's choice. Submit any panel answer honestly, even if it is wrong. The text of the option is authoritative.

### Asha nested loops independent retest

| Question | Correct answer | Current option | Reason |
|---|---|---|---|
| Three outer iterations and four inner iterations | `12` | C | Each of 3 outer iterations runs all 4 inner iterations. |
| Outer range 1 through 4 with inner `range(row)` | `10` | B | Count 1 + 2 + 3 + 4 inner executions. |
| Rows 1 and 2 with columns 0 and 1 | `[(1, 0), (1, 1), (2, 0), (2, 1)]` | A | The inner loop finishes before the next outer iteration. |

With the initial Asha baseline and all three retest answers correct, the nested-loop estimate goes **20% → 40%**. The retest itself is **3/3**. These are different measures: the estimate uses `100 × (correct + 1) / (answered + 2)` across the most recent eight eligible distinct observations. It is not the percent increase in learning, an exam-mark prediction, or proof of retention.

**If the panel answers incorrectly, say:** “This check shows that more support is needed. That is useful evidence too. The system records the actual answers instead of assuming that the lesson worked.”

**If every answer is correct, say:** “All three answers were correct in this immediate check. That is encouraging evidence. A later check would still be needed to assess retention.”

### Ishaan diagnostic if time permits

| Question | Correct answer | Current option |
|---|---|---|
| `list(range(4))` | `[0, 1, 2, 3]` | B |
| `list(range(2, 6))` | `[2, 3, 4, 5]` | C |

Two correct diagnostic answers give a 75% smoothed estimate with **limited evidence**. Do not call that established mastery. The estimate is `(2 + 1) / (2 + 2)`.

### Rahul off by one retest if specifically requested

| Question | Correct answer | Current option |
|---|---|---|
| Count labels in `range(1, 6)` | `5` | A |
| Valid nonnegative positions of a five-item list | `[0, 1, 2, 3, 4]` | D |
| Sum numbers in `range(1, 6)` | `15` | B |

This extra retest is outside the twelve-minute route. Offer it only if the panel asks and time remains.

## Three minute question period

**Where is the AI?**

“The optional Gemini integration can rephrase the approved lesson. It is off in this presentation. The running local path selects content by concept and uses deterministic scoring. I am not calling the local rules a trained machine-learning model.”

**Is this RAG?**

“This version selects local teaching material by an explicit concept identifier. It does not use a vector database, embedding search, or an unrestricted retrieval pipeline. Semantic retrieval would be a later extension if the curriculum expands.”

**What is your contribution and how did you build it?**

“I designed the learning workflow and used AI-assisted development with open-source libraries to implement it. The implementation connects the faculty view, concept evidence, targeted lessons, assessments, persistent storage, and mentor review. I can explain the request flow and the design choices.”

Use this answer only after understanding the implementation. Be ready to trace a submitted answer: browser → FastAPI validation → reviewed answer key → SQLite record → eligible evidence calculation → refreshed interface. Acknowledge assistance in line with event rules.

**What makes it different from a chatbot?**

“The contribution is the implemented workflow around the response: evidence at concept level, a targeted next step, a separate check, saved outcomes, and faculty follow-up. Existing tutoring products already offer related features; I am not claiming that adaptive tutoring itself is new.”

**How accurate is the prediction?**

“This is a transparent support-priority heuristic, not a validated failure predictor. The weights are inspectable. Predictive accuracy would require historical outcomes, an evaluation design, and held-out testing.”

**Why does 3 out of 3 become 40 percent?**

“The three-question result and the longer evidence estimate serve different purposes. The estimate still includes earlier observations and smoothing, so one short check cannot immediately erase the history. The interface shows both.”

**Does this improve marks by fifteen percent?**

“That was a proposed target in the original pitch, not a measured outcome. The current system records immediate responses. A classroom pilot and delayed assessment are needed before claiming a learning gain.”

**Can seventy real students log in now?**

“This version is a local faculty-operated prototype with seventy generated profiles. It is not yet a deployed multi-user platform. A production release needs authentication, authorization, consent and data-management policies, deployment, and load testing.”

**Why SQLite?**

“It makes the local prototype easy to start and keeps records persistent without a database server or hosting account. A production deployment with substantial concurrent access would require a separate infrastructure decision.”

**How do you prevent repeat answers inflating scores?**

“The system reopens the existing scored assessment and excludes practice from independent evidence. Distinct response evidence prevents the same question from being counted repeatedly as fresh learning.”

**Why is Omar already in mentor review?**

“He is a prepared case showing the faculty follow-up workflow. The review was not created by Asha's answers during this presentation.”

**Does acknowledgement notify Omar?**

“No. It records that a faculty member has seen the review. Messaging, scheduling, and resolution are separate actions.”

**How much does it cost to run today?**

“The current Windows-local configuration makes no cloud model calls and needs no paid hosting or database. Optional cloud generation stays disabled unless a dedicated free-tier account is verified. Token controls are additional safeguards, not proof that a billable account is free.”

## Recovery and time control

If a route is confusing, use the sidebar or **Back to student profile**. Submitted answers persist; do not start a new browser session to try to force a better result.

If the server stops, run **Start-EduPulse.cmd** and reopen the saved profile. Say: “Let me reopen the saved student record so you can inspect the result.” If an optional feature fails, return to the core workflow.

If you reach minute 8 before finishing Asha, shorten Rahul and Ishaan to one screen each, show Omar's existing review, and use a thirty-second technology explanation. Keep the final sentence and leave time for questions.

If given only 60 seconds:

“Imagine seventy students leaving a programming lesson with different gaps. EduPulse helps faculty decide who needs help with what. Asha gets a nested-loop lesson, Rahul needs an off-by-one explanation, Ishaan begins with assessment, and Omar needs a mentor conversation. Here is a live answer being saved and reflected in the student profile. The current system runs locally on Windows with reviewed teaching material and no cloud model calls. These are generated records, and learning improvement still needs a classroom study. The next step is a supervised pilot with delayed retesting. Thank you.”

## Claims to avoid

- A trained model predicts failure or identifies an exact misconception from the available evidence.
- The project guarantees higher marks or a hackathon prize.
- Generated student records are real institutional records.
- Three correct answers establish permanent mastery.
- A mentor acknowledgement resolves the student's difficulty or sends a notification.
- A local workspace is a production login system.
- Every explanation is guaranteed to be factually correct.


## Keep answers beside the application

Double-click **Open-Answer-Key.cmd**, or open **docs/ANSWER_KEY.html**. Choose **Compact corner view** or **Open small window**. Keep this private window on your laptop, or print it, while the classroom application is projected. It includes all 24 questions, option letters, exact outputs, and explanations.

Quick retest key: **Asha / nested loops: C, B, A. Rahul / off-by-one: A, D, B. Loop boundaries: C, A, D.** The corresponding output is also shown so you can check the actual question, not just memorize a letter.

Use **Compare students** before and after Asha’s retest to show a saved state changing for one learner while the other learner’s evidence stays independent. A complete second retest is optional; the twelve-minute route only opens Rahul’s different lesson. If you do enter prepared responses, describe them as presentation inputs, not as observed learning gains.
