from pathlib import Path
import re, json, html, shutil, hashlib
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
TMP=ROOT/'tmp/pdfs'; TMP.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Segoe','C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold','C:/Windows/Fonts/segoeuib.ttf'))
pdfmetrics.registerFontFamily('Segoe',normal='Segoe',bold='SegoeBold',italic='Segoe',boldItalic='SegoeBold')
NAVY=HexColor('#142D44'); TEAL=HexColor('#087F82'); INK=HexColor('#24384B'); MUTED=HexColor('#53677B')
styles={
'body':ParagraphStyle('body',fontName='Segoe',fontSize=14,leading=20,textColor=INK,spaceAfter=10),
'title':ParagraphStyle('title',fontName='SegoeBold',fontSize=30,leading=36,textColor=NAVY,spaceAfter=18),
'h1':ParagraphStyle('h1',fontName='SegoeBold',fontSize=23,leading=29,textColor=NAVY,spaceAfter=17,keepWithNext=True),
'h2':ParagraphStyle('h2',fontName='SegoeBold',fontSize=18,leading=24,textColor=NAVY,spaceBefore=12,spaceAfter=12,keepWithNext=True),
'cue':ParagraphStyle('cue',fontName='SegoeBold',fontSize=12,leading=17,textColor=TEAL,spaceAfter=14,keepWithNext=True),
'question':ParagraphStyle('question',fontName='SegoeBold',fontSize=14,leading=20,textColor=NAVY,spaceAfter=10,keepWithNext=True),
'actions':ParagraphStyle('actions',fontName='Segoe',fontSize=14,leading=20,textColor=NAVY,spaceAfter=10,borderColor=HexColor('#C9E2E2'),borderWidth=1,borderPadding=12,backColor=HexColor('#F1F8F8')),
'bullet':ParagraphStyle('bullet',fontName='Segoe',fontSize=14,leading=20,textColor=INK,leftIndent=15,firstLineIndent=-12,spaceAfter=9)}
def clean(s): return s.replace('\u2011','-').replace('\u2013','-').replace('\u2014',' - ').replace('\u2192',' > ')
def inline(s):
    s=html.escape(clean(s)); s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
    tick=chr(96); s=re.sub(tick+'([^'+tick+']+)'+tick,r'<font color="#087F82">\1</font>',s)
    return s
def p(s,style='body'): return Paragraph(inline(s),styles[style])
source=(ROOT/'docs/SPEAKER_NOTES.md').read_text(encoding='utf-8-sig')
slide_titles=['Problem and classroom situation','One class, four support paths','Asha and concept evidence','Targeted lesson','Live assessment','Saved progress','Compare Asha and Rahul','Ishaan and missing evidence','Omar and mentor follow-up','Architecture and the role of AI','Practical value and next steps']
actions=[
'Stay on SLIDE 1 while telling the story. Keep the live application ready in another window. This is a hypothetical situation, not a claimed personal incident. Do not read the speaker notes from the projected screen.',
'Advance to SLIDE 2. Point to the 70-student class and the four named paths. At the end, switch to the live browser with Alt+Tab. The following seven sections are performed in the application; slides 3-9 are visual backups.',
'LIVE APP: click Students in the sidebar. In Search name or ID, type Asha. Click Asha Raman. Pause 10-15 seconds for the panel response. Show the three concept bars, then scroll to Why this support priority? Explain the values actually displayed. Generated baseline records do not include inspectable historical question text. SLIDE 3 is the backup.',
'LIVE APP: on Asha’s profile, click Open learning plan. Show Let’s break it down, A worked example, and OUTPUT. Click Where this lesson comes from to expand the source. Scroll to I’ve reviewed the lesson and click it. Point to Practice with feedback. Then click Take independent retest. Do not claim the few seconds on screen constitute a completed learning intervention. SLIDE 4 is the backup.',
'LIVE APP: read question 1, invite one panel member to choose, and wait up to 30 seconds. Click the chosen option, then Submit answer. Click Next question. Select and submit question 2, then Next question. Select and submit question 3, then See my results. Submit the panel’s actual choice even if wrong. See the private answer key later in this PDF. Feedback remains hidden until completion. Allow about 75 seconds for reading, clicks, and participation. SLIDE 5 is the backup.',
'LIVE APP: read the actual correct count. Click View updated learning plan to show Evidence snapshot. From the original baseline, a fully correct retest produces 20% before and 40% current, while the retest result is 3/3. Click Return to student profile. If an answer was wrong, say “This result tells us that more support is needed.” Do not claim predetermined improvement. SLIDE 6 is the backup.',
'LIVE APP: click Compare students in the sidebar. Select Asha Raman and Rahul Raj if they are not already selected. Show both evidence profiles. Open Rahul’s student profile using the profile link in his comparison card, then click Open learning plan. Show the off-by-one lesson; do not complete another retest. If the displayed values have changed, describe them as shown. SLIDE 7 is the backup.',
'LIVE APP: click Students, type Ishaan in Search name or ID, then click Ishaan Das. Point to Not assessed and missing engagement values. Click Start diagnostic and show the first question. Submission is optional. If you complete the two questions, retain the Limited evidence qualification. Allow 10 seconds to inspect the difference. SLIDE 8 is the backup.',
'LIVE APP: click Mentor review. Show Omar Farooq’s existing record. Click Inspect learning evidence, then return with the sidebar Mentor review link. Click Acknowledge review if still open. If already acknowledged, select All reviews. This is a prepared case; do not claim Asha’s answers created it. After this section, return to PowerPoint with Alt+Tab and jump to SLIDE 10. SLIDE 9 is the backup.',
'Return to SLIDE 10. Trace learner and faculty screens, React Router UI, FastAPI validation, SQLite records, the evidence rules, lessons and retest, and faculty review. Point to Gemini as the optional provider-backed explanation branch. Discuss present integration status candidly if asked, using the private implementation note. SLIDE 12 is an optional deployment-roadmap appendix after the closing slide 11.',
'Advance to SLIDE 11 and deliver the closing statement. Stop at 12 minutes and invite questions. Keep approximately three minutes of the fifteen-minute slot available. If a question requires evidence, return to the saved app screen rather than guessing.']
section_index=-1; rendered=[]; in_exact=False
for line in source.splitlines():
    if line=='## Exact speaker notes': in_exact=True
    elif line.startswith('## ') and in_exact: in_exact=False
    if in_exact and line.startswith('### '):
        section_index+=1; rendered.append(line); rendered.append('')
        rendered.append('**Slide cue:** '+str(section_index+1)+' / '+slide_titles[section_index]+' / '+('LIVE APPLICATION; slide is a backup' if 2<=section_index<=8 else 'PROJECT THE SLIDE'))
    elif in_exact and line.startswith('**On screen:**'): rendered.append('**Exact practical actions:** '+actions[section_index])
    else: rendered.append(line)
ai_text="""## Where AI fits in this implementation

**CURRENTLY DISABLED: no cloud model calls are needed for this presentation.** Keep this page private unless the panel asks about implementation.

### Exact answer to give the panel

“AI has two roles in this project. I used AI-assisted development to help implement and review the system. Separately, the application has an optional Gemini integration that can rephrase a reviewed lesson. That integration is currently off. The running presentation uses the local lessons, and the scoring and answer checking are deterministic. I can show you precisely where the optional model would enter the request flow.”

### The practical point where a model would be used

In an enabled configuration, the lesson page can show **Personalize explanation**. That button is intentionally hidden while cloud generation is disabled. It sends a request to **POST /api/interventions/{id}/personalize**. The implementation is the **personalize** function in **backend/app.py**.

The backend retrieves the selected concept's reviewed lesson and misconception description. It supplies that content as context and requests structured text: **title, summary, steps, takeaway, and source_id**. It tells the model not to change the code example or invent citations.

The optional provider is configured as **Gemini 3.5 Flash-Lite**. The application reserves a usage allowance, counts the input tokens, and requests structured JSON. Pydantic validates the fields and lengths. The backend checks the source identifier and completion status before storing the explanation. The original code example and answer keys are not generated by the model.

A matching source identifier and valid JSON do not prove factual accuracy. If generation fails or the returned content fails these checks, the reviewed lesson remains available. There is no automatic retry and no paid-provider fallback.

### What is not an AI model here

The concept evidence estimate, support-priority weights, answer grading, retest completion status, and current lesson selection are implemented rules. They do not come from a trained model. Lesson selection uses an explicit concept identifier; this version does not use an embedding model, vector database, or unrestricted retrieval system.

### Show the current setting without changing it

Open **Workspace settings** and point to **Cloud generation: Disabled**. Say: “The live journey you just saw uses no cloud model calls. Optional generation is an extension point, not a dependency for this presentation.”

Do not add a key during the panel slot. Any future activation requires a dedicated verified Free Tier project with billing disabled. Token caps do not themselves guarantee a billable account is free.

### One sentence if time is short

“AI helped me build the application, and an optional model can rephrase approved lessons; today that model is off, while the complete learning workflow and deterministic grading run locally.”

### Private production readiness and optional slide 12

The current system is a functional localhost prototype, not an institutional multi-user deployment. The optional provider integration is implemented but disabled in this configuration; a successful live call and account eligibility have not been verified for the presentation. Do not describe the provider as active.

SLIDE 12 is an optional technical appendix for questions after the closing slide 11. Real authentication, separate student and faculty roles, institutional authorization, a durable production database, HTTPS deployment, scheduled backups and restore testing, operational monitoring, provider approval, and consented data policies are planned production work. They are not represented as implemented features of the local workspace.

If asked how it becomes a real product, say: “The working local request flow is the foundation. The next deployment stage adds authenticated student and faculty access, server-side role checks, a durable managed database, HTTPS, backups, and approved provider configuration. Those production services would need a separately approved cost and security plan; I am not presenting them as already deployed.”
"""
full='\n'.join(rendered).replace('## Three minute question period',ai_text+'\n\n## Three minute question period')
route="""## Presentation switching guide

**Slides 1 and 2:** explain the situation and introduce the four student paths.

**Live application for sections 3 through 9:** Asha evidence > lesson > retest > saved progress > Compare students with Rahul > Ishaan > Omar. Slides 3-9 are aligned backups; you do not need to switch back for every click.

**Slides 10 and 11:** return to the deck for architecture, the AI role, and the closing. In PowerPoint Slide Show, type **10** and press **Enter** to jump to slide 10. Use **Alt+Tab** to switch between PowerPoint and the prepared browser.

Open the answer key only on a private laptop display or printed page. Do not project the keys with the application.
"""
full=full.replace('## Private preparation checklist',route+'\n\n## Private preparation checklist')
tech=(ROOT/'docs/TECH_STACK.md').read_text(encoding='utf-8-sig')
tech_intro=tech.split('\n\n',2)[1]
tech_table=tech.split('## Technology choices',1)[1].split('\n\nThe frontend',1)[0].strip()
full+='\n\n## Private technical reference\n\n'+tech_intro+'\n\n'+tech_table+'\n'
story=[Spacer(1,36),p('EDUPULSE','cue'),p('Complete speaker notes','title'),p('Twelve-minute presentation and live application guide','h1'),p('CSE Year One | 70 students | 11 aligned sections','cue'),p('Exact spoken script, slide cues, practical clicks, panel interactions, answer keys, AI explanation, and Q&A.'),Spacer(1,16),p('PRIVATE PRESENTER COPY','cue'),p('Keep this PDF off the projected display. It contains answer keys and rehearsal directions. The core presentation runs locally on Windows with cloud generation disabled.','actions'),Spacer(1,16),p('Presentation target: 12 minutes. Reserve about 3 minutes for questions.'),PageBreak()]
def render_md(md):
    i=0; ls=md.splitlines()
    while i<len(ls):
        line=ls[i].strip()
        if not line: i+=1; continue
        if line.startswith('# '): i+=1; continue
        if line.startswith('## '):
            if line=='## Exact speaker notes': i+=1; continue
            if line!='## Presentation switching guide' and story and not isinstance(story[-1],PageBreak): story.append(PageBreak())
            story.append(p(line[3:],'h1')); i+=1; continue
        if line.startswith('### '):
            heading=line[4:]
            if re.match(r'\d+:\d+',heading):
                if story and not isinstance(story[-1],PageBreak): story.append(PageBreak())
            story.append(p(heading,'h2')); i+=1; continue
        if line.startswith('|'):
            rows=[]
            while i<len(ls) and ls[i].strip().startswith('|'):
                cells=[x.strip() for x in ls[i].strip().strip('|').split('|')]
                if not all(re.match(r'^[-: ]+$',x) for x in cells): rows.append(cells)
                i+=1
            if rows:
                heads=rows[0]
                for n,row in enumerate(rows[1:],1):
                    items=[p('Item '+str(n),'cue')]
                    for head,cell in zip(heads,row): items.append(p('**'+head+':** '+cell))
                    story.append(KeepTogether(items)); story.append(Spacer(1,8))
            continue
        if line.startswith('- '): story.append(p('- '+line[2:],'bullet')); i+=1; continue
        paragraph=[line]; i+=1
        while i<len(ls) and ls[i].strip() and not ls[i].startswith(('#','- ','|')):
            paragraph.append(ls[i].strip()); i+=1
        text=' '.join(paragraph)
        style='actions' if text.startswith('**Exact practical actions:**') else 'cue' if text.startswith('**Slide cue:**') else 'question' if text.startswith('**') and text.endswith('**') else 'body'
        story.append(p(text,style))
render_md(full)
class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw): super().__init__(*a,**kw); self.saved=[]
    def showPage(self): self.saved.append(dict(self.__dict__)); self._startPage()
    def save(self):
        total=len(self.saved)
        for state in self.saved:
            self.__dict__.update(state); w,h=self._pagesize
            self.setStrokeColor(TEAL); self.setLineWidth(1); self.line(48,h-40,w-48,h-40)
            self.setFont('SegoeBold',9); self.setFillColor(NAVY); self.drawString(48,h-29,'EDUPULSE  /  COMPLETE SPEAKER NOTES')
            self.setFont('Segoe',9); self.setFillColor(MUTED); self.drawString(48,27,'Private presenter copy')
            self.drawRightString(w-48,27,f'{self._pageNumber} / {total}'); super().showPage()
        super().save()
target=OUT/'EduPulse_Complete_Speaker_Notes.pdf'
doc=SimpleDocTemplate(str(target),pagesize=(595.28,841.89),leftMargin=48,rightMargin=48,topMargin=57,bottomMargin=48,title='EduPulse Complete Speaker Notes',author='EduPulse',pageCompression=1)
doc.build(story,canvasmaker=NumberedCanvas)
reader=PdfReader(target); text='\n'.join(pg.extract_text() for pg in reader.pages)
spoken=re.findall(r'\*\*Say:\*\*\s*\n\s*\n(.*?)\n\s*\n\*\*On screen:',source,re.S)
assert len(spoken)==11,len(spoken)
normalize=lambda x: re.sub(r'\s+',' ',clean(x)).strip()
for section in spoken: assert normalize(section) in normalize(text),section[:40]
assert all(t in normalize(text) for t in ['CURRENTLY DISABLED','Personalize explanation','Pydantic','Submit answer','See my results','Acknowledge review','Private answer key'])
dest=Path("C:/Users/Don's Property/Downloads/EduPulse_Complete_Speaker_Notes.pdf")
shutil.copy2(target,dest)
assert hashlib.sha256(target.read_bytes()).digest()==hashlib.sha256(dest.read_bytes()).digest()
result={'pages':len(reader.pages),'output':str(target),'downloads':str(dest),'all_11_spoken_paragraphs_present':True,'identical_copies':True}
(TMP/'pdf-validation.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))

