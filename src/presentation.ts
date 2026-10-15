// Timed speaker notes. Stage directions are not spoken or displayed to students.
export const presentationSections: [string, string, string, string][] = [
  [
    "A simple classroom situation",
    "0:00–1:00",
    "Good morning. Imagine a first-year Computer Science class with seventy students. The teacher finishes a lesson on loops and asks, “Is everyone clear?” A few students say yes. Some stay quiet. The class moves on. A week later, an assessment shows that several students were struggling with different parts of the lesson. Now the teacher has to work backwards: who needs help, what exactly is confusing them, and what should happen next? I used that simple, hypothetical classroom situation as my starting point. And that is how I came up with this idea: EduPulse, a system that helps faculty turn a learning gap into a clear next action.",
    "Start on the faculty overview. Keep the cursor still during the opening story. This is an imagined situation, not a claim about a personal classroom incident.",
  ],
  [
    "Introduce the class",
    "1:00–1:50",
    "This is the workspace for CSE, Year One. We can move from the whole class to one student, inspect a concept, open a learning plan, and return to see what changed. The important point is that seventy students do not need seventy copies of the same advice. Today I will show four situations: Asha needs help with nested loops; Rahul needs a different starting point; Ishaan has no assessment evidence yet; and Omar needs a mentor conversation. Together, they show how the same system can support different decisions.",
    "Show the 70-student count. Open Students and briefly point to search and the support filters. Do not scroll through the entire class.",
  ],
  [
    "Let the panel choose the evidence",
    "1:50–3:00",
    "Let us begin with Asha. Before I open her learning plan, may I ask you one question? If a student attends most classes and submits most assignments, is that enough to decide which topic she understands? I would still want to see her answers. Here, attendance and assignment completion provide context, while the concept scores show where to investigate. Asha's clearest gap is nested loops. The support priority also shows its ingredients, so a teacher can inspect the reasoning. It is a transparent prioritization rule. The purpose is to direct attention toward useful evidence and a practical next step.",
    "Search Asha and open her profile. Pause 10–15 seconds for one panel response. Show all three concept bars and the priority breakdown. Do not imply that generated baseline records contain inspectable historical question text.",
  ],
  [
    "Give the right lesson",
    "3:00–4:05",
    "I will open Asha's learning plan. The lesson concentrates on one idea: each outer-loop iteration starts another complete run of the inner loop. The explanation is broken into small steps, followed by a worked example. The teaching reference is visible, and the practice questions give feedback. That gives the student a way to work on the gap before taking another check. In the current configuration, these are reviewed local lessons. Optional Gemini generation can rephrase approved material, but it is switched off today. The useful workflow still works. I am moving through this lesson quickly to show the system; a real learner would take the time they need.",
    "Click Open learning plan for nested loops. Show the lesson steps, code example, and source reference. Mark the lesson reviewed. Briefly point to Practice with feedback, then choose the independent retest.",
  ],
  [
    "Ask the panel to take part",
    "4:05–6:05",
    "Now we check what the learner can do with different questions. Would one of you choose the first answer? There are three outer iterations and four inner iterations. How many times does the inner statement run? Please choose the option you would submit. I will enter the answer you choose. The response is saved, and feedback stays hidden until the check is complete so it does not teach the remaining answers. I will finish the other two questions to show the full journey. Notice that submitting an answer changes real saved state; this is not a slide animation.",
    "Allow up to 30 seconds for the first response; submit it honestly. Complete the other two items without reading this private answer key aloud. Click See my results. This section includes about 75 seconds of reading, clicking, and panel participation.",
  ],
  [
    "Show what actually changed",
    "6:05–7:05",
    "Here is the result from the answers we just submitted. Let us return to the learning plan and then the student profile. The current estimate uses the recent response history, so it is different from the percentage correct in this single check. A good immediate result is useful evidence, but it does not establish long-term retention. A later assessment would be needed for that. What we can demonstrate now is the completed loop: a gap led to a lesson, the lesson led to a check, and the check produced a saved result that faculty can use.",
    "Read the actual correct count. If all three were correct from a fresh Asha baseline, point to 20% before and 40% current; explain that 3/3 is the retest result while 40% is the smoothed recent-evidence estimate. If any were wrong, say: “This result tells us that more support is needed.” Never claim a predetermined improvement.",
  ],
  [
    "Show a different student need",
    "7:05–8:05",
    "Now let us look at Rahul. His profile does not look like Asha's. His off-by-one and nested-loop estimates are tied at the low end; the system selects off-by-one first in the course order. An off-by-one problem means a loop may run once too few or once too many. His focused lesson therefore checks the intended first and last values, rather than repeating Asha's nested-loop explanation. This is the practical meaning of targeting support at a concept. The teacher can inspect the other concepts too, and choose a different starting point when their classroom knowledge suggests one.",
    "Open Compare students to show Asha and Rahul side by side. Then open Rahul’s profile and his off-by-one plan to show its distinct lesson. Do not complete another retest. If the profile has changed during rehearsal, describe the displayed recommendation instead.",
  ],
  [
    "Handle missing evidence honestly",
    "8:05–9:00",
    "Ishaan is a third situation. We do not yet have answers from him. The system therefore shows that he has not been assessed. It does not assign him a zero or declare that he needs urgent support simply because data is missing. His next step is a short diagnostic. After those first answers, the evidence remains limited; two responses are only a starting point. That distinction matters in a real class: a missing record and a demonstrated learning gap should lead to different conversations. Here, the teacher can see which situation they are dealing with.",
    "Search Ishaan. Point to Not assessed and missing engagement values. Open Start diagnostic and show the first question; submission is optional. If submitted, retain the Limited evidence label in the explanation. Allow 10 seconds for the panel to inspect the contrast.",
  ],
  [
    "Bring a mentor into the loop",
    "9:00–10:00",
    "Finally, there is Omar. Some difficulties need a conversation with a person. The mentor-review area makes that next action visible, with the student's name, concept, and reason for review. A teacher can open the evidence and acknowledge the item. Acknowledging means it has been seen; it does not mean the learning difficulty has disappeared. It also does not send a message or email. This is the faculty workflow that connects the learning activity to follow-up. EduPulse keeps the teacher involved in deciding what kind of support the student needs.",
    "Open Mentor review. Show Omar's existing review and its reason. Open his evidence, then return and acknowledge if the item is still open. If already acknowledged from rehearsal, use All reviews. Explain this as a prepared case, not a newly triggered review.",
  ],
  [
    "Explain how it works",
    "10:00–11:15",
    "The interface uses React and TypeScript, with Vite for the build, React Router for navigation, CSS for the visual design, and Lucide icons. Python and FastAPI handle the requests, and SQLite stores progress on this Windows machine. When I submit an option, the server checks a reviewed answer key, records the response, recalculates eligible evidence, and returns the updated view. Grading and prioritization are reproducible. I am not claiming a trained failure-prediction model. The optional Gemini connection only changes explanations; it does not decide whether an answer is right. Cloud generation is currently off, so this presentation needs no API key, paid hosting, or cloud database. The local learning flow also continues without internet.",
    "Open Workspace settings to show local storage and disabled cloud generation, then return to the overview. Keep the technical explanation at this level unless the panel requests code. Do not enable an API during the presentation.",
  ],
  [
    "Close with the next step",
    "11:15–12:00",
    "The result is a working connection between a class view and a student's next step. Asha receives focused support, Rahul gets a different lesson, Ishaan begins with assessment, and Omar stays connected to a mentor. My next step would be a supervised classroom pilot: review the teaching content with faculty, use consented records, and measure delayed learning as well as immediate answers. The question I want EduPulse to help a teacher answer is simple: who needs help with what, and what should we do next? Thank you. I would be happy to take your questions.",
    "End on the overview. Stop at 12 minutes and keep the remaining approximately 3 minutes of the 15-minute slot for questions.",
  ],
];
