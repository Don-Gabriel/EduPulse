from pathlib import Path
import html, shutil, hashlib
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Segoe','C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold','C:/Windows/Fonts/segoeuib.ttf'))
pdfmetrics.registerFontFamily('Segoe',normal='Segoe',bold='SegoeBold')
PAGES=[
('EduPulse: every screen explained',[
('What this guide is','A plain-English reference to the website: what each page shows, what each term means, what a button changes, and how to explain the system to the panel.'),
('The purpose','Help faculty notice a specific learning gap after teaching, give focused support, and check the next response. Teaching a topic and verifying that students understood it are different tasks.'),
('Scope at a glance','One CSE Year 1 class; 70 prepared student profiles; one course, Python Foundations; 3 concepts; 24 fixed questions. The 70 profiles are not 70 simultaneous logged-in users.'),
('The complete journey','Student evidence > recommended concept > learning plan > lesson > practice > independent retest > saved progress > faculty follow-up when needed.'),
('How to read this guide','Pages 2-3 explain concepts and scores. Pages 4-17 explain navigation and screens. Pages 18-19 give vocabulary and a practical walkthrough. Read the numbers actually displayed: actions can change them.'),
('Current-state note','Ishaan has already answered his two-question diagnostic correctly. He now has 75% loop-boundary evidence with only two observations. Do not describe his current profile as entirely unassessed; the other two concepts remain unassessed.')]),
('1 / What concepts are being tested?',[
('Concept means one specific skill','A concept is a small learning target inside the course. Here the course is Python Foundations, and the three targets are about Python loops.'),
('Loop boundaries','Understanding where range starts, where it stops, and its step. The stop value is excluded. Example: range(1, 4) gives 1, 2, 3. Internal identifier: boundaries.'),
('Off-by-one errors','Spotting when a loop runs one time too many or too few, or a list index is one position outside its valid range. A list with 5 items has indices 0 to 4. Internal identifier: off_by_one.'),
('Nested-loop execution','Tracing an inner loop for every outer-loop iteration. Three outer runs and four inner runs each give 12 inner executions. Changing inner bounds require tracing each run. Identifier: nested_loops.'),
('Exactly how many questions?','Each concept has 2 diagnostic + 3 practice + 3 retest questions = 8. Across 3 concepts: 6 diagnostic + 9 practice + 9 retest = 24. They are a fixed reviewed bank, not freshly generated questions.'),
('What 24 does not mean','A learner does not answer all 24 in one assessment. Each assessment covers one concept and one phase. Prepared historical evidence is separate from these 24 interactive questions.')]),
('2 / Understand the two scores',[
('Concept evidence: higher is stronger','For each concept: 100 x (correct + 1) / (answered + 2), rounded. It uses up to 8 recent distinct eligible responses. Practice and unfinished retests are excluded. No responses means Not assessed, not 0%.'),
('Why add 1 and 2?','This smoothing avoids treating a very small sample as certain mastery. Two correct answers produce 3/4 = 75%, rather than 100%. Fewer than 3 responses are marked limited evidence.'),
('Support priority: higher means more attention','This separate score combines the weakest assessed concept gap (70%), assignment-completion gap (15%), and attendance gap (15%). Available weights are normalized if signals are missing. Without any concept evidence, there is no priority score.'),
('Priority labels','55-100: Priority support. 35-54: Keep an eye. 0-34: On track. No score: Not assessed. These labels guide support; they are not predicted exam marks.'),
('Worked example','At the prepared baseline, Asha has 20% nested-loop evidence, 75% assignments, and 90% attendance. Contributions are about 56 + 3.8 + 1.5 points, producing priority 61/100.'),
('Two different colour scales','Concept bars: below 40% = low; 40-64% = middle; 65% or above = stronger. Priority labels use the separate thresholds above. A strong concept percentage and a high priority number mean different things.')]),
('3 / Navigation used across the website',[
('Sidebar','Overview, Students, Compare students, Learning plans, Class insights, and Mentor review are the main work areas. Course library and Workspace settings are under Resources.'),
('Workspace breadcrumb','The path at the top shows your current section. Workspace returns to the overview. A breadcrumb is simply a navigation trail.'),
('Find a student','The top search matches names and student IDs. It shows up to five matching profiles. Click a result, or press Enter for the first match. Escape clears the search.'),
('Bell and review count','The bell opens Mentor review. The badge counts open review items. It is an internal queue, not an email or messaging service.'),
('Profile menu','The top-right name menu contains Open student view, Speaker notes, and Workspace settings. Open student view goes to a profile; it does not log into a separate student account.'),
('Back and saving','Use the sidebar, breadcrumb, page back links, or browser Back. Submitted responses are saved in SQLite on this computer. Selecting an option alone does not save it; Submit answer does.'),
('Small screens and errors','The menu button opens the sidebar on a narrow screen. Loading and empty states explain unavailable content. An unknown URL shows a return-to-overview action.')]),
('4 / Overview: the class starting point',[
('Purpose and route','Overview (/) answers: where should the faculty member look first? It combines counts, support priorities, student shortcuts, and recent activity.'),
('Students in your class','The count of student records, currently 70. The note identifies Python Foundations and its 3 concepts.'),
('Priority support','Number of students whose support-priority score is at least 55. It is a count of people to review, not the number expected to fail.'),
('Learning plans','Number of saved student-concept plans. It is not a question count, lesson-library count, or necessarily the number of unique students. One learner may have plans for different concepts.'),
('Retests completed well','Number of plans whose independent retest had every question correct. A 3/3 immediate retest qualifies; it does not establish long-term retention.'),
('Where your attention matters','The four highest-priority assessed students. Class pulse shows how students are distributed among the four support labels. Clicking a student opens their evidence.'),
('Learning, in motion','Recent submitted responses, with their phase and outcome. Unfinished retest correctness is hidden until completion. The four named journey cards are shortcuts, not a restriction to four learners.')]),
('5 / Students: find the right record',[
('Purpose and route','Students (/students) lists the entire class. It lets faculty move from a class-level concern to a particular learner.'),
('Filters','All students, Priority support, Keep an eye, On track, and Not assessed select groups using the support labels. They do not change student data.'),
('Search and sort','Search name or ID narrows the list. Sort by Student ID, Highest priority, or Name A-Z. A search, filter, or sort change returns the list to page 1.'),
('Table columns','Student gives name and roll ID. Focus concept is the lowest-scoring assessed concept. The smaller text gives correct/eligible response counts. Support priority shows the score and its label.'),
('Pagination','Fifteen records appear per page. With all 70 visible, there are five pages: four pages of 15 and one of 10. The Previous and Next buttons only move through the list.'),
('Export evidence','Downloads a CSV with Student, Concept, Evidence score, Independent answers, and Support priority. It exports the whole class, not just the current filter. With 70 students and 3 concepts, it contains 210 data rows.'),
('Next action','Click the name or arrow to open the profile. Explain: This is where a teacher decides whose learning evidence to inspect next.')]),
('6 / Student profile: understand the gap',[
('Purpose and route','A profile (/students/<student ID>) combines concept evidence, engagement context, response history, and saved plans.'),
('Learning overview tab','Shows all three concepts, their estimates, and correct/response counts. Recommended focus marks the lowest assessed concept. If two concepts tie, course order selects the first.'),
('Quick check and next best step','Quick check opens that concept\'s two-question diagnostic. Open learning plan creates or reopens support for the recommended concept. With no assessed concept, Start diagnostic begins the first concept in the course.'),
('Why this support priority?','Shows the individual contributions to the priority score. Engagement context shows attendance over the last 10 classes and completion of the last 4 assignments. Missing values are Not recorded; these figures are not edited or imported automatically here.'),
('Response history tab','Lists actual saved diagnostic, practice, and completed-retest responses. Prepared baseline records are not listed. The title Responses from this session should not be read as browser-only storage: saved activity persists after refresh.'),
('Learning plans tab','Shows this learner\'s existing plans. The count is the number of plans, not completed lessons.'),
('Important interpretation','On track can be based on one assessed concept while others remain blank. Always inspect coverage and the limited-evidence note before drawing a conclusion.')]),
('7 / Compare students: different support',[
('Purpose and route','Compare students (/compare) places two profiles beside each other. It helps faculty explain why learners in the same class may need different teaching support.'),
('Choosing records','First student and Second student selectors contain all 70 profiles. Choose two different students for a useful comparison. Changing a selector does not modify either record.'),
('What each side contains','The same three concept estimates and response counts used on the individual profile; attendance; assignment completion; support priority; next focus; and saved-plan count.'),
('What updates','After a completed independent assessment, the corresponding learner\'s saved evidence can change. The other learner\'s responses remain independent. Reopening comparison reads the updated workspace data.'),
('Useful interpretation','Compare the shape of the concept gaps, not only the total priority. A learner can attend regularly while still struggling with one concept. Another can have a different gap and therefore a different lesson.'),
('Next action','Use Open [name]\'s profile to inspect the details or open the learning plan. This screen compares learning needs; it does not create a class ranking or issue a prediction.')]),
('8 / Learning plans: what a plan means',[
('Plain-English definition','A learning plan is a saved support record for ONE student and ONE concept. It connects the starting evidence, a focused lesson, practice, a retest, and any need for faculty follow-up.'),
('Purpose and route','Learning plans (/plans) collects plans from across the class. Choose a student opens the class list. A plan card opens its lesson page.'),
('Ready to start','The plan has been created, but the lesson has not been marked reviewed. Internal state: assigned.'),
('Learning in progress','The learner clicked I\'ve reviewed the lesson. Practice and retest controls become available. This records the action, not a measurement of time spent or understanding. Internal state: learning.'),
('Retest completed','Every answer in the independent retest was correct. Internal state: verified. The overview counts these as Retests completed well.'),
('Further support','The retest finished with at least one incorrect answer. Internal state: needs_support. The lesson page offers Request mentor review.'),
('Reopening a plan','The current bank supports one saved plan per learner-concept pair. Opening it again resumes that record; it does not generate a fresh scored copy. Lesson, practice and retest are stages within the plan.')]),
('9 / Lesson: targeted teaching material',[
('Purpose and route','The learning-plan page (/learn/<plan ID>) teaches the selected concept and shows its related assessment actions.'),
('Identify > Learn > Verify','The step indicator means a concept was selected, its lesson can be studied, and a separate retest checks the response. The displayed time is an estimate, not a timer.'),
('Lesson content','The idea to watch for describes a common misconception for the concept. Let\'s break it down gives steps. A worked example shows Python code and its prepared output. Keep this in mind is the takeaway.'),
('What misconception means here','A common way this concept is misunderstood. The current system associates it with the selected concept; it does not infer a precise mental explanation from every wrong option.'),
('Source-backed lesson','Where this lesson comes from expands the official teaching reference. The explanation is original local content based on that reference. Opening the external reference needs internet; reading the saved lesson does not.'),
('I\'ve reviewed the lesson','Saves the reviewed state and unlocks Practice with feedback and Take independent retest. Practice is recommended, but the interface allows the retest once the lesson is reviewed.'),
('Evidence snapshot','Before this plan is the estimate when the plan was created. Current estimate reads the latest eligible responses. Reading alone does not increase the score. Code blocks are examples to trace; the page is not a Python code runner.')]),
('10 / Assessment: three different modes',[
('Shared screen','All modes use /quiz/<session ID>. The header identifies student, concept, and mode. Question progress shows the current question and how many answers have been submitted.'),
('Diagnostic: 2 questions','An initial quick check for one concept. Feedback is available after each answer. It contributes independent evidence, but two observations still count as limited evidence.'),
('Practice: 3 questions','Learning with feedback. Each submitted answer can show the correct output and explanation. Practice is excluded from independent evidence, so repeating it cannot inflate the concept estimate.'),
('Independent retest: 3 questions','A separate fixed question set after the lesson, without hints during the attempt. Answers save immediately, but correctness, explanations, and evidence updates remain hidden until completion.'),
('Exact button sequence','Select A, B, C, or D > Submit answer > Next question. After the last answer, choose See my results. A selection can change before submission; a saved answer cannot be changed by clicking another option.'),
('What independent means','The system withholds retest feedback until the end and excludes practice. It does not provide proctoring or verify that no person helped the learner.'),
('Repeated attempts','Reopening an existing diagnostic or retest resumes it or shows the saved result. It does not create unlimited fresh evidence from the same questions.')]),
('11 / Result: what changed after submission?',[
('Result summary','Shows the number correct out of the questions in this assessment. Each expandable question displays its prompt, code, correct output, and explanation.'),
('Retest outcomes','3/3 changes the plan to Retest completed. 0/3, 1/3, or 2/3 changes it to Further support. Both outcomes are saved; an incorrect response is useful evidence for the next conversation.'),
('Why 3/3 may show a 40% concept estimate','The result describes only this retest. The evidence estimate includes up to eight recent distinct responses plus smoothing. From Asha\'s prepared starting state, three correct retest responses yield 3/3 now and 40% recent evidence. Other prior actions can change the values.'),
('Where the buttons go','After practice: Continue to independent retest returns to the learning-plan page. After retest: View updated learning plan shows the saved outcome. After diagnostic: Open targeted lesson opens a plan for that diagnostic\'s concept. View student evidence returns to the profile.'),
('What persists','Submitted answers, sessions, plan status, and review acknowledgements remain in the local database. Refreshing the browser does not erase them.'),
('What the result establishes','It records immediate responses to this check. A later assessment is needed to measure retention; the system does not claim an observed improvement in college examination marks.')]),
('12 / Class insights: find shared gaps',[
('Purpose and route','Class insights (/insights) helps faculty decide whether several learners need a short explanation of the same concept.'),
('Concept evidence map','Rows are students. The three concept columns show each student\'s evidence estimate. The final column gives the separate support-priority label. Click a student or score cell to open the profile.'),
('Heatmap colours','Below 40%: low evidence estimate. 40-64%: middle. 65% or higher: stronger. A dash means no assessment evidence. Missing data is not included as zero.'),
('Concept summary cards','Each card shows the average of available student estimates, rounded; the number of students assessed in that concept; and how many have an estimate below 40%.'),
('How a teacher uses it','If many students have low evidence for the same concept, revisit that topic with the class. If the gap is isolated, use an individual learning plan instead. The teacher makes the instructional decision.'),
('Export evidence','Downloads the same complete CSV as the Students screen. It is a point-in-time export; it does not synchronize an Excel file or connect to a college ERP.'),
('Interpret carefully','An average summarizes available evidence. A small response count or an unassessed portion of the class limits the conclusion. It is not a model-validated prediction.')]),
('13 / Mentor review: human follow-up',[
('Purpose and route','Mentor review (/reviews) is an internal faculty queue for learners who need a conversation or additional help.'),
('How a new item is created','After a retest with at least one wrong answer, Request mentor review appears on the lesson page. Clicking it creates an open item. A failed retest alone does not automatically send a message or create an appointment.'),
('What the card shows','Student, concept, reason for review, and status. Omar\'s existing item is a prepared case; it was not caused by another learner\'s assessment.'),
('Inspect learning evidence','Opens the associated profile so faculty can review the concept estimates and saved responses before deciding what help is appropriate.'),
('Acknowledge review','Records that the faculty member has seen the item. It moves from Needs review to Acknowledged and reduces the open-review count. It does not resolve the learning gap or notify anyone.'),
('Tabs','Needs review shows open items. Acknowledged shows items already seen. All reviews includes both. Re-requesting an already open learner-concept review reuses the open item.'),
('What comes next in real use','The teacher holds a conversation or arranges support outside the current application. Scheduling, chat, messaging, and a full case-resolution workflow are not implemented here.')]),
('14 / Course library: what is being taught?',[
('Purpose and route','Course library (/sources) lists the teaching content behind the learner journey. It is the reference point for the three concepts and question counts.'),
('Course versus concept','Python Foundations is the course. Loop boundaries, Off-by-one errors, and Nested-loop execution are the three concepts within it.'),
('What each card contains','Concept title and description, official Python documentation reference, and counts of 2 diagnostic, 3 practice, and 3 retest questions.'),
('Reviewed content','The local explanations and question keys were checked during development, including executing question code. This label does not mean an institution has formally certified the curriculum.'),
('Retrieve by concept','The selected concept ID retrieves a matching local lesson. This implementation does not search the open web or use a vector database to find lesson material.'),
('AI role','An optional provider integration can rephrase the approved lesson using the selected concept and reviewed content as context. Its structured output is checked before use. The stored answer keys still decide correctness.'),
('Current interface','The application currently uses reviewed local lessons. Personalize explanation appears only when cloud generation is configured and enabled. This guide describes the conditional feature without claiming it is active.')]),
('15 / Workspace settings: storage and AI limits',[
('Purpose and route','Workspace settings (/settings) shows connection status, classroom details, storage, and usage limits. Refresh status rereads them; it does not reset student activity.'),
('Running on this device','The browser and Python service use this Windows computer. SQLite stores records on disk. Core lessons, questions, grading, and progress do not require internet.'),
('Cloud explanations','Disabled means no optional explanation calls are enabled. Free-tier connection configured means the configuration gate is enabled; that wording alone is not proof of a successful provider response or account billing status.'),
('Tokens and reservations','Tokens are the text units a language model processes. Reserved tokens are budget held aside before a call, so uncertain usage is counted conservatively. These are usage controls, not currency amounts.'),
('Visible ceilings','20 calls per rolling 24 hours; 50,000 daily tokens used or reserved; 100,000 lifetime tokens; up to 2,000 input and 800 output tokens per request; one active call; two requests per minute. No automatic retries or paid fallback.'),
('Zero-spend behaviour','Cloud calls remain disabled in the present configuration. Enabling them would require verified account eligibility and billing controls; application token limits alone cannot prove a billable account will cost nothing.'),
('Optional AI scope','Explanation wording can change; grading and support priority remain explicit rules. There is no trained failure-prediction model in this implementation.')]),
('16 / Private presenter screen and help states',[
('Speaker notes screen','Open the profile menu > Speaker notes (/present). It contains timed speaking sections, On screen instructions, Previous / Next section controls, a Print notes button, and prepared panel answers.'),
('Keep it private','This is a presenter aid, not a student learning feature. It can expose answer guidance and presentation wording. The classroom sidebar does not list it.'),
('Separate answer reference','Open-Answer-Key.cmd opens docs/ANSWER_KEY.html. Compact corner view or Open small window keeps the 24 answer keys nearby. It is a local reference outside the application\'s served assessment routes.'),
('No matching students','Clear the name/ID search or change the support filter. No matching result does not mean a learner was deleted.'),
('No plans or reviews','An empty list means there are no saved records matching that page\'s current state or filter. Choose a student to create a plan; check All reviews for acknowledged items.'),
('Page or server unavailable','Use Go to overview for an unknown route. If the local server stopped, run Start-EduPulse.cmd. Do not reset the class just to reopen a page.'),
('Deck revision note','The revised product PPT explains the problem, purpose, workflow, architecture, and differentiation without named students. The older speaker script\'s slide-number cues belong to the earlier deck; do not use those numbers to navigate the revised PPT.')]),
('17 / Terms you can explain in one sentence',[
('Learning gap / remediation','A gap is a specific skill that needs more support. Remediation means focused teaching or practice aimed at that gap.'),
('Learning plan / intervention','The user-facing term is learning plan. The backend calls the same saved student-concept support record an intervention.'),
('Evidence / baseline','Evidence means eligible saved responses used in the estimate. Baseline means the estimate recorded when a plan began, used for a before/current comparison.'),
('Diagnostic / practice / retest','Diagnostic checks the starting point; practice teaches through feedback; retest checks separate questions after the lesson.'),
('Independent / limited evidence','Independent excludes guided practice and withholds retest hints. Limited evidence means fewer than three eligible observations, so the estimate is based on little data.'),
('Engagement / support priority','Engagement describes participation signals such as attendance and assignments. Support priority combines gaps in available signals to guide faculty attention.'),
('Misconception / source-backed','A misconception is a common misunderstanding associated with the concept. Source-backed means a visible teaching reference supports the local explanation.'),
('API / database / session','An API is how the browser asks the server to read or save information. The database persists it. An assessment session groups one learner\'s questions and responses for a concept and phase.')]),
('18 / A practical route through the website',[
('1. Start with the class','Overview > Students. Explain that the teacher can inspect 70 learners and prioritize attention after a lesson without opening every profile first.'),
('2. Inspect one learning need','Open a profile. Read the three concepts and actual response counts. Explain why the recommended concept was selected, and distinguish concept evidence from support priority.'),
('3. Follow the support path','Open learning plan > read the worked example > expand its source > I\'ve reviewed the lesson. Show practice, then open the separate retest.'),
('4. Save an answer and its result','Select an answer > Submit answer > Next question. Complete all questions > See my results > View updated learning plan. Describe the result actually saved, including wrong answers.'),
('5. Return to the faculty decision','Compare students to show different needs. Class insights shows whether the gap is shared across the class. Mentor review provides a human follow-up path when further support is needed.'),
('Ishaan in the current workspace','His loop-boundary diagnostic has already produced 2/2 and a smoothed 75% estimate. The other two concepts have no responses. Use this to explain limited evidence and partial coverage; reopening the same diagnostic will show its existing result.'),
('Where these explanations come from','Verified against src/App.tsx (screens and labels), backend/app.py (state, grading, evidence and export), data/curriculum.json (concepts and questions), and the running local workspace. Application data may change as you interact.')])
]
styles={
 'title':ParagraphStyle('title',fontName='SegoeBold',fontSize=25,leading=30,textColor=HexColor('#123747'),spaceAfter=18),
 'head':ParagraphStyle('head',fontName='SegoeBold',fontSize=13.5,leading=18,textColor=HexColor('#007E77'),spaceBefore=8,spaceAfter=4,keepWithNext=True),
 'body':ParagraphStyle('body',fontName='Segoe',fontSize=13,leading=18,textColor=HexColor('#253F4B'),spaceAfter=6)
}
story=[]
for i,(title,items) in enumerate(PAGES):
 if i:story.append(PageBreak())
 story.append(Paragraph(html.escape(title),styles['title']))
 for heading,body in items:
  story.append(Paragraph(html.escape(heading),styles['head']))
  story.append(Paragraph(html.escape(body),styles['body']))
def footer(c,d):
 c.setStrokeColor(HexColor('#007E77'));c.line(44,804,551,804)
 c.setFont('SegoeBold',9);c.setFillColor(HexColor('#123747'));c.drawString(44,814,'EDUPULSE / WEBSITE EXPLANATION GUIDE')
 c.setFont('Segoe',9);c.drawString(44,25,'Private reference | Screens, terminology and practical working')
 c.drawRightString(551,25,str(d.page))
target=OUT/'EduPulse_Website_Screen_Guide.pdf'
SimpleDocTemplate(str(target),pagesize=(595.28,841.89),leftMargin=44,rightMargin=44,topMargin=55,bottomMargin=43,title='EduPulse Website Screen Guide',author='EduPulse').build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(target)
assert len(reader.pages)==len(PAGES),(len(reader.pages),len(PAGES))
text='\n'.join(p.extract_text() for p in reader.pages)
for key in ['24','Learning plans','75%','Support priority','Class insights','Mentor review']:assert key in text
dest=Path("C:/Users/Don's Property/Downloads/EduPulse_Website_Screen_Guide.pdf")
shutil.copy2(target,dest)
assert hashlib.sha256(target.read_bytes()).digest()==hashlib.sha256(dest.read_bytes()).digest()
print(f'{len(reader.pages)} pages: {dest}')
