import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { presentationSections } from "./presentation";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Flag,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Play,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WifiOff,
  X,
} from "lucide-react";

type Evidence = {
  score: number | null;
  correct: number;
  count: number;
  limited: boolean;
};
type Student = {
  id: string;
  name: string;
  initials: string;
  roll: string;
  attendance: number | null;
  assignments: number | null;
  color: string;
  evidence: Record<string, Evidence>;
  weakest: string | null;
  priority: number | null;
  band: string;
  contributions: { label: string; points: number; detail: string }[];
  interventions: any[];
};
type Concept = {
  id: string;
  title: string;
  description: string;
  prerequisite: string | null;
  misconception: string;
  source: { title: string; url: string; section: string };
  lesson: any;
};
type Bootstrap = {
  course: any;
  concepts: Concept[];
  students: Student[];
  reviews: any[];
  recent: any[];
  ai: any;
  synthetic: boolean;
};
type Context = {
  data: Bootstrap;
  reload: () => Promise<void>;
  toast: (message: string) => void;
};
const Ctx = createContext<Context>(null!);
const useApp = () => useContext(Ctx);
const bandLabel: Record<string, string> = {
  high: "Priority support",
  watch: "Keep an eye",
  on_track: "On track",
  not_assessed: "Not assessed",
};
const statusLabel: Record<string, string> = {
  assigned: "Ready to start",
  learning: "Learning in progress",
  verified: "Retest completed",
  needs_support: "Further support",
};

async function api(path: string, body?: unknown) {
  const res = await fetch("/api" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const json = await res.json();
      message = typeof json.detail === "string" ? json.detail : message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function Badge({ band, children }: { band?: string; children?: ReactNode }) {
  return (
    <span className={"badge " + (band || "neutral")}>
      {children || bandLabel[band || ""]}
    </span>
  );
}
function Avatar({ student, size = "" }: { student: Student; size?: string }) {
  return (
    <span className={"avatar " + student.color + " " + size}>
      {student.initials}
    </span>
  );
}
function Empty({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <BookOpen size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
function Loading() {
  return (
    <div className="loading">
      <span className="spinner" />
      Loading your workspace…
    </div>
  );
}
function Meter({ value, label }: { value: number | null; label?: string }) {
  return (
    <div className="meter-wrap">
      <div
        className="meter"
        role="progressbar"
        aria-label={label || "Concept evidence score"}
        aria-valuenow={value ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          style={{ width: (value ?? 0) + "%" }}
          className={
            value === null
              ? ""
              : value < 40
                ? "low"
                : value < 65
                  ? "mid"
                  : "good"
          }
        />
      </div>
      <span>{value === null ? "—" : value + "%"}</span>
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="title-actions">{actions}</div>}
    </div>
  );
}
function Back({
  to,
  label = "Back to overview",
}: {
  to: string;
  label?: string;
}) {
  return (
    <Link className="back-link" to={to}>
      <ArrowLeft size={17} />
      {label}
    </Link>
  );
}

export default function App() {
  const [data, setData] = useState<Bootstrap | null>(null),
    [error, setError] = useState(""),
    [notification, setNotification] = useState("");
  const reload = async () => {
    try {
      setData(await api("/bootstrap"));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    void reload();
    const refresh = () => void reload();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(""), 6500);
      return () => clearTimeout(t);
    }
  }, [notification]);
  if (!data)
    return (
      <div className="startup">
        <div className="brand-mark">
          <Activity />
        </div>
        <h1>EduPulse</h1>
        {error ? (
          <>
            <p>{error}</p>
            <button className="button primary" onClick={reload}>
              Try again
            </button>
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
  return (
    <Ctx.Provider value={{ data, reload, toast: setNotification }}>
      <Shell />
      {notification && (
        <div className="toast" role="status">
          <CheckCircle2 size={20} />
          <span>{notification}</span>
          <IconButton
            label="Dismiss notification"
            onClick={() => setNotification("")}
          >
            <X size={16} />
          </IconButton>
        </div>
      )}
    </Ctx.Provider>
  );
}

function Shell() {
  const { data } = useApp(),
    location = useLocation(),
    navigate = useNavigate();
  const [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(""),
    [profile, setProfile] = useState(false);
  useEffect(() => {
    setMobile(false);
    setSearch("");
    setProfile(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const nav = [
    ["/", "Overview", LayoutDashboard],
    ["/students", "Students", Users],
    ["/compare", "Compare students", Users],
    ["/plans", "Learning plans", BookOpen],
    ["/insights", "Class insights", TrendingUp],
    ["/reviews", "Mentor review", MessageSquare],
  ] as const;
  const matches = data.students.filter((s) =>
    (s.name + " " + s.roll).toLowerCase().includes(search.toLowerCase()),
  );
  const section =
    location.pathname === "/compare"
      ? "Compare students"
      : location.pathname.startsWith("/students")
        ? "Students"
        : location.pathname.startsWith("/learn") ||
            location.pathname.startsWith("/quiz") ||
            location.pathname === "/plans"
          ? "Learning plans"
          : location.pathname === "/insights"
            ? "Class insights"
            : location.pathname === "/reviews"
              ? "Mentor review"
              : location.pathname === "/sources"
                ? "Course library"
                : location.pathname === "/settings"
                  ? "Workspace settings"
                  : location.pathname === "/present"
                    ? "Presenter guide"
                    : "Overview";
  const reviewCount = data.reviews.filter((r) => r.status === "open").length;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {mobile && (
        <button
          className="sidebar-overlay"
          onClick={() => setMobile(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Activity size={25} />
          </span>
          <span>
            EduPulse<span className="brand-sub">LEARNING, IN FOCUS</span>
          </span>
        </Link>
        <div className="workspace">
          <span className="workspace-icon">
            <GraduationCap size={23} />
          </span>
          <div>
            <strong>Faculty workspace</strong>
            <span>Computer Science · Year 1</span>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(([path, label, Icon]) => (
            <NavLink key={path} to={path} end={path === "/"}>
              <Icon size={20} />
              <span>{label}</span>
              {path === "/reviews" && reviewCount > 0 && (
                <span className="nav-count">{reviewCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="nav-label secondary">RESOURCES</div>
        <nav>
          <NavLink to="/sources">
            <FileText size={20} />
            <span>Course library</span>
          </NavLink>
          <NavLink to="/settings">
            <Settings2 size={20} />
            <span>Workspace settings</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="local-card">
            <span className="status-dot" />
            <div>
              <strong>Running on this device</strong>
              <p>Progress saves automatically</p>
            </div>
            <ShieldCheck size={20} />
          </div>
          <div className="sidebar-caption">CSE / YEAR 1</div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <div className="breadcrumb">
              <Link to="/">Workspace</Link>
              <ChevronRight size={15} />
              <span>{section}</span>
            </div>
          </div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={18} />
              <input
                aria-label="Search students"
                placeholder="Find a student…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearch("");
                  if (e.key === "Enter" && matches[0])
                    navigate("/students/" + matches[0].id);
                }}
              />
              {search && (
                <div className="search-results">
                  {matches.length ? (
                    matches.slice(0, 5).map((s) => (
                      <Link key={s.id} to={"/students/" + s.id}>
                        <Avatar student={s} />
                        <span>
                          {s.name}
                          <small>{s.roll}</small>
                        </span>
                        <ChevronRight size={16} />
                      </Link>
                    ))
                  ) : (
                    <p>No matching student</p>
                  )}
                </div>
              )}
            </div>
            <Link
              className="icon-button notification-button"
              aria-label={`${reviewCount} open mentor reviews`}
              to="/reviews"
            >
              <Bell size={21} />
              {reviewCount > 0 && <i />}
            </Link>
            <div className="profile">
              <button
                className="profile-button"
                onClick={() => setProfile(!profile)}
                aria-expanded={profile}
              >
                <span className="profile-avatar">JG</span>
                <span className="profile-name">
                  Don Gabriel<small>Faculty</small>
                </span>
                <ChevronDown size={15} />
              </button>
              {profile && (
                <div className="profile-menu">
                  <Link to="/students/asha">Open student view</Link>
                  <Link to="/present">Speaker notes</Link>
                  <Link to="/settings">Workspace settings</Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main id="main">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<Students />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/students/:sid" element={<StudentDetail />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/learn/:iid" element={<Lesson />} />
            <Route path="/quiz/:qid" element={<Quiz />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/present" element={<Presenter />} />
            <Route
              path="*"
              element={
                <Empty
                  title="This page isn’t here"
                  description="Return to your workspace to continue."
                >
                  <Link className="button primary" to="/">
                    Go to overview
                  </Link>
                </Empty>
              }
            />
          </Routes>
          <footer className="page-footer">
            <span>
              <ShieldCheck size={15} />
              CSE · Year 1 · Python Foundations
            </span>
            <span>Designed for earlier, more personal support.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Overview() {
  const { data } = useApp();
  const priority = data.students.filter((s) => s.band === "high"),
    onTrack = data.students.filter((s) => s.band === "on_track");
  const plans = data.students.flatMap((s) => s.interventions),
    verified = plans.filter((p) => p.status === "verified");
  const focus = [...data.students]
    .filter((s) => s.priority !== null)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .slice(0, 4);
  return (
    <>
      <PageTitle
        eyebrow="YOUR CLASS AT A GLANCE"
        title="A little support. A lasting difference."
        description="See the learning gaps. Make the next step personal."
        actions={
          <Link className="button secondary" to="/insights">
            <TrendingUp size={18} />
            Class insights
          </Link>
        }
      />
      <div className="overview-hero">
        <div className="hero-copy">
          <div className="hero-label">
            <span className="pulse-dot" />
            EARLY SUPPORT, CLEAR DIRECTION
          </div>
          <h2>
            Every learning gap
            <br />
            is a chance to help.
          </h2>
          <p>
            Seventy students share a classroom, but not the same learning needs.
            Find each gap, choose a focused lesson, and check what changes.
          </p>
          <Link className="button light" to="/students">
            Explore your class
            <ArrowRight size={19} />
          </Link>
          <span className="hero-footnote">
            One class. Individual next steps.
          </span>
        </div>
        <div className="hero-journey">
          <div className="journey-line" />
          {[
            ["01", "Notice the gap", "Quiz responses reveal a pattern", Target],
            [
              "02",
              "Make it click",
              "A lesson for the identified concept gap",
              Lightbulb,
            ],
            [
              "03",
              "Check the learning",
              "An independent retest closes the loop",
              CheckCircle2,
            ],
          ].map(([n, title, sub, Icon]: any) => (
            <div className="journey-step" key={n}>
              <span className="journey-icon">
                <Icon size={22} />
              </span>
              <div>
                <span className="journey-number">{n}</span>
                <strong>{title}</strong>
                <p>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        <Stat
          icon={<Users />}
          label="Students in your class"
          value={data.students.length}
          note="Python Foundations · 3 concepts"
        />
        <Stat
          icon={<Flag />}
          label="Priority support"
          value={priority.length}
          note="Evidence worth a closer look"
          accent="amber"
        />
        <Stat
          icon={<BookOpen />}
          label="Learning plans"
          value={plans.length}
          note={
            plans.length
              ? "Personalized paths started"
              : "Ready when your students are"
          }
          accent="blue"
        />
        <Stat
          icon={<CheckCircle2 />}
          label="Retests completed well"
          value={verified.length}
          note="All questions correct, independently"
          accent="teal"
        />
      </div>
      <section
        className="class-journeys"
        aria-label="Different learning journeys"
      >
        {[
          [
            "asha",
            "A focused concept gap",
            "Build confidence with nested loops.",
          ],
          ["rahul", "A different starting point", "Work on off-by-one errors."],
          ["ishaan", "Begin with evidence", "Start a first diagnostic check."],
          [
            "omar",
            "Bring a mentor in",
            "Review persistent difficulty together.",
          ],
        ].map(([id, title, note]) => {
          const student = data.students.find((s) => s.id === id)!;
          return (
            <Link
              className="panel journey-card"
              to={"/students/" + id}
              key={id}
            >
              <div>
                <Avatar student={student} />
                <ArrowRight size={18} />
              </div>
              <strong>{student.name}</strong>
              <span>{title}</span>
              <p>{note}</p>
            </Link>
          );
        })}
      </section>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Where your attention matters</h2>
              <p>Prioritized by recent learning evidence and engagement.</p>
            </div>
            <Link className="text-link" to="/students">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <StudentTable students={focus} />
          <div className="panel-foot">
            <CircleHelp size={16} />
            Support priorities guide a conversation; they are not failure
            predictions.
          </div>
        </section>
        <section className="panel class-pulse">
          <div className="panel-heading">
            <div>
              <h2>Class pulse</h2>
              <p>Current evidence, at a glance.</p>
            </div>
            <Activity size={20} />
          </div>
          <div className="pulse-number">
            <strong>
              {onTrack.length}
              <span> / {data.students.length}</span>
            </strong>
            <span>students currently on track</span>
          </div>
          <div className="distribution-bar">
            {["on_track", "watch", "high", "not_assessed"].map((b) => (
              <span
                key={b}
                className={b}
                style={{
                  flex: data.students.filter((s) => s.band === b).length,
                }}
              />
            ))}
          </div>
          <div className="pulse-legend">
            {["on_track", "watch", "high", "not_assessed"].map((b) => (
              <div key={b}>
                <span>
                  <i className={b} />
                  {bandLabel[b]}
                </span>
                <strong>
                  {data.students.filter((s) => s.band === b).length}
                </strong>
              </div>
            ))}
          </div>
          <Link className="button secondary full" to="/insights">
            Explore concept evidence
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
      <div className="dashboard-grid lower">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Learning, in motion</h2>
              <p>Recent assessment activity across your class.</p>
            </div>
            <Clock3 size={20} />
          </div>
          {data.recent.length ? (
            <div className="activity-list">
              {data.recent.slice(0, 4).map((r: any) => (
                <div key={r.id}>
                  <span
                    className={
                      "activity-icon " + (r.correct ? "success" : "warning")
                    }
                  >
                    {r.correct ? <Check size={17} /> : <BookOpen size={17} />}
                  </span>
                  <div>
                    <strong>{r.name}</strong>
                    <p>
                      {r.phase === "retest"
                        ? "Independent retest"
                        : r.phase === "practice"
                          ? "Practice"
                          : "Diagnostic"}{" "}
                      ·{" "}
                      {data.concepts.find((c) => c.id === r.concept_id)?.title}
                    </p>
                  </div>
                  <Badge band={r.correct ? "on_track" : "watch"}>
                    {r.correct ? "Correct" : "Review needed"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="quiet-state">
              <span>
                <Activity size={24} />
              </span>
              <div>
                <strong>Your next small step starts here.</strong>
                <p>
                  Open a student’s learning journey. Their responses will appear
                  here as they happen.
                </p>
              </div>
            </div>
          )}
        </section>
        <section className="note-panel">
          <div className="note-icon">
            <Lightbulb size={23} />
          </div>
          <h3>Evidence before assumptions.</h3>
          <p>
            A missed assignment tells you about engagement. A wrong loop trace
            tells you about understanding. EduPulse keeps those signals visible
            and distinct.
          </p>
          <Link className="text-link" to="/sources">
            See the teaching material
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </>
  );
}
function Stat({
  icon,
  label,
  value,
  note,
  accent = "",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  note: string;
  accent?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={"stat-icon " + accent}>{icon}</span>
      </div>
      <strong>{value.toString().padStart(2, "0")}</strong>
      <p>{note}</p>
    </div>
  );
}
function StudentTable({ students }: { students: Student[] }) {
  const { data } = useApp();
  return (
    <div className="table-scroll">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Focus concept</th>
            <th>Support priority</th>
            <th>
              <span className="sr-only">Open student</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>
                <Link className="student-cell" to={"/students/" + s.id}>
                  <Avatar student={s} />
                  <span>
                    <strong>{s.name}</strong>
                    <small>{s.roll}</small>
                  </span>
                </Link>
              </td>
              <td>
                <span>
                  {data.concepts.find((c) => c.id === s.weakest)?.title ||
                    "Start a diagnostic"}
                </span>
                <small>
                  {s.weakest
                    ? `${s.evidence[s.weakest].correct} / ${s.evidence[s.weakest].count} independent answers correct`
                    : "No assessment evidence yet"}
                </small>
              </td>
              <td>
                <div className="priority-cell">
                  <strong>
                    {s.priority ?? "—"}
                    <small>{s.priority !== null ? "/100" : ""}</small>
                  </strong>
                  <Badge band={s.band} />
                </div>
              </td>
              <td>
                <Link
                  className="row-arrow"
                  aria-label={"Open " + s.name}
                  to={"/students/" + s.id}
                >
                  <ArrowRight size={19} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Students() {
  const { data } = useApp();
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [sort, setSort] = useState("roll"),
    [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, filter, sort]);
  const rows = data.students
    .filter(
      (s) =>
        (filter === "all" || s.band === filter) &&
        (s.name + " " + s.roll).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "priority"
        ? (b.priority ?? -1) - (a.priority ?? -1)
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : a.roll.localeCompare(b.roll),
    );
  const pages = Math.max(1, Math.ceil(rows.length / 15)),
    current = Math.min(page, pages),
    visible = rows.slice((current - 1) * 15, current * 15);
  return (
    <>
      <PageTitle
        eyebrow="CSE · YEAR 1"
        title="Your students"
        description="One class. A different next step for every learner."
        actions={
          <a className="button secondary" href="/api/export">
            <ArrowDownToLine size={18} />
            Export evidence
          </a>
        }
      />
      <section className="panel">
        <div className="list-toolbar">
          <div className="filter-tabs" aria-label="Filter students">
            {[
              ["all", "All students"],
              ["high", "Priority support"],
              ["watch", "Keep an eye"],
              ["on_track", "On track"],
              ["not_assessed", "Not assessed"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={filter === k ? "active" : ""}
                aria-pressed={filter === k}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="input-search">
            <Search size={18} />
            <input
              aria-label="Filter student list"
              placeholder="Search name or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="class-filter-select"
            aria-label="Sort students"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="roll">Student ID</option>
            <option value="priority">Highest priority</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        {rows.length ? (
          <StudentTable students={visible} />
        ) : (
          <Empty
            title="No students match"
            description="Try a different name or change the filter."
          />
        )}
        <div className="pagination">
          <span>
            {rows.length
              ? `${(current - 1) * 15 + 1}–${Math.min(current * 15, rows.length)}`
              : "0"}{" "}
            of {rows.length} students
          </span>
          <div>
            <button
              className="button secondary"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <button
              className="button secondary"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
          <span>
            Page {current} of {pages}
          </span>
        </div>
      </section>
    </>
  );
}

function Compare() {
  const { data } = useApp();
  const [left, setLeft] = useState("asha"),
    [right, setRight] = useState("rahul");
  const a = data.students.find((s) => s.id === left)!,
    b = data.students.find((s) => s.id === right)!;
  return (
    <>
      <PageTitle
        eyebrow="CSE · YEAR 1"
        title="Different learners. Clear next steps."
        description="Compare two students using the same evidence, with room for different support."
      />
      <div className="comparison-grid">
        {[
          [a, left, setLeft],
          [b, right, setRight],
        ].map(([student, selected, update]: any, index) => (
          <section className="panel comparison-card" key={index}>
            <label className="field-label" htmlFor={"compare-" + index}>
              {index === 0 ? "First student" : "Second student"}
            </label>
            <select
              id={"compare-" + index}
              className="class-filter-select"
              value={selected}
              onChange={(e) => update(e.target.value)}
            >
              {data.students.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name} · {s.roll}
                </option>
              ))}
            </select>
            <div className="compare-person">
              <Avatar student={student} size="large" />
              <div>
                <h2>{student.name}</h2>
                <p>{student.roll}</p>
              </div>
            </div>
            <Badge band={student.band} />
            <div className="compare-concepts">
              {data.concepts.map((c) => (
                <div key={c.id}>
                  <strong>{c.title}</strong>
                  <Meter
                    value={student.evidence[c.id].score}
                    label={student.name + " " + c.title}
                  />
                  <small>
                    {student.evidence[c.id].count
                      ? student.evidence[c.id].correct +
                        " of " +
                        student.evidence[c.id].count +
                        " independent answers correct"
                      : "No assessment evidence yet"}
                  </small>
                </div>
              ))}
            </div>
            <div className="compare-context">
              <span>
                Attendance
                <strong>
                  {student.attendance === null
                    ? "—"
                    : Math.round(student.attendance * 100) + "%"}
                </strong>
              </span>
              <span>
                Assignments
                <strong>
                  {student.assignments === null
                    ? "—"
                    : Math.round(student.assignments * 100) + "%"}
                </strong>
              </span>
              <span>
                Priority
                <strong>
                  {student.priority === null ? "—" : student.priority + "/100"}
                </strong>
              </span>
            </div>
            <div className="compare-next">
              <span>NEXT FOCUS</span>
              <h3>
                {data.concepts.find((c) => c.id === student.weakest)?.title ||
                  "Start with a diagnostic"}
              </h3>
              <p>
                {student.interventions.length
                  ? student.interventions.length +
                    " learning plan" +
                    (student.interventions.length === 1 ? "" : "s") +
                    " saved"
                  : "Choose a lesson from the current concept evidence."}
              </p>
            </div>
            <Link
              className="button primary full"
              to={"/students/" + student.id}
            >
              Open {student.name.split(" ")[0]}’s profile
              <ArrowRight size={17} />
            </Link>
          </section>
        ))}
      </div>
      <div className="info-banner">
        <CircleHelp size={21} />
        <p>
          Compare learning needs, not student worth. Priorities guide support;
          they are not predictions of exam marks. The evidence updates from
          saved independent responses.
        </p>
      </div>
    </>
  );
}

function StudentDetail() {
  const { sid } = useParams();
  const { data, reload, toast } = useApp();
  const [detail, setDetail] = useState<any>(null),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(""),
    [tab, setTab] = useState("overview");
  const navigate = useNavigate();
  useEffect(() => {
    setDetail(null);
    setErr("");
    api("/students/" + sid)
      .then(setDetail)
      .catch((e) => setErr(e.message));
  }, [sid]);
  const start = async (cid: string, phase?: string) => {
    setBusy(cid + (phase || ""));
    try {
      if (phase) {
        const s = await api("/sessions", {
          student_id: sid,
          concept_id: cid,
          phase,
        });
        navigate("/quiz/" + s.id);
      } else {
        const p = await api("/interventions", {
          student_id: sid,
          concept_id: cid,
        });
        await reload();
        navigate("/learn/" + p.id);
      }
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setBusy("");
    }
  };
  if (err)
    return (
      <Empty title="Student unavailable" description={err}>
        <Link to="/students" className="button secondary">
          Back to students
        </Link>
      </Empty>
    );
  if (!detail) return <Loading />;
  const s = detail as Student;
  const target = s.weakest || data.concepts[0].id;
  const concept = data.concepts.find((c) => c.id === target)!;
  return (
    <>
      <Back to="/students" label="All students" />
      <div className="student-heading">
        <div className="student-heading-name">
          <Avatar student={s} size="large" />
          <div>
            <div className="eyebrow">STUDENT LEARNING PROFILE</div>
            <h1>{s.name}</h1>
            <p>
              {s.roll} <span>·</span> Computer Science <span>·</span> Year 1
            </p>
          </div>
        </div>
        <Badge band={s.band} />
      </div>
      <div className="page-tabs">
        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          Learning overview
        </button>
        <button
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          Response history <span>{detail.attempts.length}</span>
        </button>
        <button
          className={tab === "plans" ? "active" : ""}
          onClick={() => setTab("plans")}
        >
          Learning plans <span>{s.interventions.length}</span>
        </button>
      </div>
      {tab === "overview" ? (
        <>
          <div className="student-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Understanding, concept by concept</h2>
                  <p>Based on the latest independent assessment evidence.</p>
                </div>
                <Target size={22} />
              </div>
              <div className="concept-list">
                {data.concepts.map((c) => {
                  const e = s.evidence[c.id];
                  return (
                    <div className="concept-row" key={c.id}>
                      <div className="concept-title">
                        <div>
                          <strong>{c.title}</strong>
                          <p>{c.description}</p>
                        </div>
                        {c.id === target && e.score !== null && (
                          <Badge band="watch">Recommended focus</Badge>
                        )}
                      </div>
                      <Meter value={e.score} label={c.title} />
                      <div className="concept-bottom">
                        <span>
                          {e.count
                            ? `${e.correct} of ${e.count} recent answers correct${e.limited ? " · limited evidence" : ""}`
                            : "Not enough evidence yet"}
                        </span>
                        <button
                          className="text-link"
                          disabled={!!busy}
                          onClick={() => start(c.id, "diagnostic")}
                        >
                          Quick check
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="panel-foot">
                <CircleHelp size={17} />
                Evidence estimate = (correct + 1) ÷ (answered + 2). Not a
                validated mastery probability.
              </div>
            </section>
            <section className="recommendation">
              <div className="eyebrow">
                <Sparkles size={16} />
                NEXT BEST STEP
              </div>
              <h2>
                {s.weakest
                  ? "Make " + concept.title.toLowerCase() + " click."
                  : "Start with a quick check."}
              </h2>
              <p>
                {s.weakest
                  ? concept.misconception
                  : "A short diagnostic helps us choose an appropriate learning path without guessing."}
              </p>
              <div className="recommendation-meta">
                <span>
                  <Clock3 size={17} />
                  {s.weakest ? "About 5 minutes" : "About 2 minutes"}
                </span>
                <span>
                  <BookOpen size={17} />
                  {s.weakest ? "Source-backed lesson" : "Start with evidence"}
                </span>
                <span>
                  <ListChecks size={17} />
                  {s.weakest
                    ? "3-question independent retest"
                    : "2-question diagnostic"}
                </span>
              </div>
              <button
                className="button primary full"
                disabled={!!busy}
                onClick={() =>
                  start(target, s.weakest ? undefined : "diagnostic")
                }
              >
                {busy ? <span className="spinner small" /> : <Play size={18} />}{" "}
                {s.weakest ? "Open learning plan" : "Start diagnostic"}
                <ArrowRight size={18} />
              </button>
              <small>Adapt the explanation. Check the understanding.</small>
            </section>
          </div>
          <div className="student-grid bottom">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Why this support priority?</h2>
                  <p>
                    Every signal is visible. Every contribution is traceable.
                  </p>
                </div>
                <div className="priority-total">
                  {s.priority ?? "—"}
                  <span>/100</span>
                </div>
              </div>
              <div className="reason-list">
                {s.contributions.length ? (
                  s.contributions.map((c, i) => (
                    <div key={c.label}>
                      <span className={"reason-number r" + i}>{i + 1}</span>
                      <div>
                        <strong>{c.label}</strong>
                        <p>{c.detail}</p>
                      </div>
                      <strong className="reason-points">+{c.points}</strong>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    A diagnostic is needed before assigning a learning support
                    priority.
                  </p>
                )}
              </div>
              <div className="panel-foot">
                Priority weights: learning evidence 70%, assignments 15%,
                attendance 15%. Missing signals are excluded.
              </div>
            </section>
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Engagement context</h2>
                  <p>Signals for a conversation, not a judgment.</p>
                </div>
              </div>
              <div className="engagement">
                <div>
                  <span>Recent attendance</span>
                  <strong>
                    {s.attendance === null
                      ? "Not recorded"
                      : Math.round(s.attendance * 100) + "%"}
                  </strong>
                  <small>Last 10 classes</small>
                </div>
                <div>
                  <span>Assignments completed</span>
                  <strong>
                    {s.assignments === null
                      ? "Not recorded"
                      : Math.round(s.assignments * 100) + "%"}
                  </strong>
                  <small>Last 4 assignments</small>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : tab === "history" ? (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Responses from this session</h2>
              <p>Saved diagnostic, practice, and retest responses.</p>
            </div>
          </div>
          {detail.attempts.length ? (
            <div className="history-list">
              {detail.attempts.map((a: any) => (
                <div key={a.id}>
                  <span
                    className={
                      "activity-icon " + (a.correct ? "success" : "warning")
                    }
                  >
                    {a.correct ? <Check /> : <BookOpen />}
                  </span>
                  <div>
                    <strong>
                      {data.concepts.find((c) => c.id === a.concept_id)?.title}
                    </strong>
                    <p>
                      {a.phase} ·{" "}
                      {new Date(a.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {a.hinted
                        ? " · practice, excluded from evidence score"
                        : ""}
                    </p>
                  </div>
                  <Badge band={a.correct ? "on_track" : "watch"}>
                    {a.correct ? "Correct" : "Needs review"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="Your first response starts the story"
              description="Complete a quick check or learning plan to build a visible evidence trail."
            />
          )}
        </section>
      ) : (
        <PlanList plans={s.interventions.map((p) => ({ ...p, student: s }))} />
      )}
    </>
  );
}

function Plans() {
  const { data } = useApp();
  const plans = data.students.flatMap((s) =>
    s.interventions.map((p) => ({ ...p, student: s })),
  );
  return (
    <>
      <PageTitle
        eyebrow="PERSONAL SUPPORT"
        title="Small lessons. Clear next steps."
        description="Every plan connects a learning gap to an independent check."
        actions={
          <Link className="button primary" to="/students">
            <Users size={18} />
            Choose a student
          </Link>
        }
      />
      <PlanList plans={plans} />
    </>
  );
}
function PlanList({ plans }: { plans: any[] }) {
  const { data } = useApp();
  return plans.length ? (
    <div className="plans-grid">
      {plans.map((p) => (
        <Link className="plan-card" key={p.id} to={"/learn/" + p.id}>
          <div className="plan-card-top">
            <span className="plan-icon">
              <BookOpen size={23} />
            </span>
            <Badge
              band={
                p.status === "verified"
                  ? "on_track"
                  : p.status === "needs_support"
                    ? "watch"
                    : "neutral"
              }
            >
              {statusLabel[p.status]}
            </Badge>
          </div>
          <h2>{data.concepts.find((c) => c.id === p.concept_id)?.title}</h2>
          <div className="student-cell">
            <Avatar student={p.student} />
            <span>
              <strong>{p.student.name}</strong>
              <small>{p.student.roll}</small>
            </span>
          </div>
          <div className="plan-card-bottom">
            <span>Lesson · Practice · Retest</span>
            <ArrowRight size={19} />
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <section className="panel">
      <Empty
        title="A personal path starts with one student"
        description="Choose a student, inspect their evidence, and open a targeted learning plan."
      >
        <Link className="button primary" to="/students/asha">
          Start with Asha
          <ArrowRight size={17} />
        </Link>
      </Empty>
    </section>
  );
}

function Lesson() {
  const { iid } = useParams(),
    navigate = useNavigate();
  const { data, reload, toast } = useApp();
  const [plan, setPlan] = useState<any>(null),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(""),
    [showSource, setShowSource] = useState(false);
  useEffect(() => {
    api("/interventions/" + iid)
      .then(setPlan)
      .catch((e) => setErr(e.message));
  }, [iid]);
  const act = async (action: string) => {
    setBusy(action);
    try {
      if (action === "review") {
        await api("/interventions/" + iid + "/review", {});
        await reload();
        toast(
          "Mentor review requested. The saved evidence is ready to discuss.",
        );
        navigate("/reviews");
      } else if (action === "read") {
        setPlan(await api("/interventions/" + iid + "/read", {}));
        await reload();
        toast(
          "Lesson marked reviewed. You can practice or take an independent retest.",
        );
      } else if (action === "personalize") {
        const updated = await api("/interventions/" + iid + "/personalize", {});
        setPlan(updated);
        await reload();
        toast(updated.notice || "A source-grounded explanation is ready.");
      } else {
        const s = await api("/sessions", {
          student_id: plan.student_id,
          concept_id: plan.concept_id,
          phase: action,
          intervention_id: iid,
        });
        navigate("/quiz/" + s.id);
      }
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setBusy("");
    }
  };
  if (err) return <Empty title="Learning plan unavailable" description={err} />;
  if (!plan) return <Loading />;
  const l = plan.lesson,
    c = plan.concept,
    completed = ["verified", "needs_support"].includes(plan.status),
    result = plan.sessions.find(
      (s: any) => s.phase === "retest" && s.completed_at,
    );
  return (
    <>
      <Back
        to={"/students/" + plan.student_id}
        label={"Back to " + plan.student.name.split(" ")[0] + "’s profile"}
      />
      <PageTitle
        eyebrow="A PERSONAL LEARNING PATH"
        title={c.title}
        description={
          "A focused lesson for " +
          plan.student.name +
          ". Understand it, try it, then check it independently."
        }
      />
      <div className="learning-stepper">
        <span className="done">
          <CheckCircle2 size={20} />
          1. Identify
        </span>
        <i />
        <span className={plan.status !== "assigned" ? "done" : "current"}>
          <BookOpen size={20} />
          2. Learn
        </span>
        <i />
        <span className={completed ? "done" : "current-next"}>
          <ListChecks size={20} />
          3. Verify
        </span>
      </div>
      <div className="lesson-grid">
        <article className="panel lesson-content">
          <div className="lesson-top">
            <Badge band={plan.mode === "generated" ? "blue" : "on_track"}>
              {plan.mode === "generated" ? (
                <>
                  <Sparkles size={14} />
                  AI-generated explanation
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  Reviewed teaching material
                </>
              )}
            </Badge>
            <span>
              <Clock3 size={16} />
              About 5 minutes
            </span>
          </div>
          <h2>{l.title}</h2>
          <p className="lesson-summary">{l.summary}</p>
          <div className="misconception">
            <Lightbulb size={22} />
            <div>
              <strong>The idea to watch for</strong>
              <p>{c.misconception}</p>
            </div>
          </div>
          <h3>Let’s break it down</h3>
          <ol className="lesson-steps">
            {l.steps.map((step: string, i: number) => (
              <li key={i}>
                <span>{i + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <h3>A worked example</h3>
          <div className="code-block">
            <div>
              <span>
                <Code2 size={16} />
                PYTHON
              </span>
              <span>Read and trace</span>
            </div>
            <pre>{l.example_code}</pre>
          </div>
          <div className="output-block">
            <span>OUTPUT</span>
            <pre>{l.example_output}</pre>
          </div>
          <div className="takeaway">
            <CheckCircle2 size={22} />
            <div>
              <strong>Keep this in mind</strong>
              <p>{l.takeaway}</p>
            </div>
          </div>
          <button
            className="source-toggle"
            onClick={() => setShowSource(!showSource)}
            aria-expanded={showSource}
          >
            <span>
              <FileText size={18} />
              Where this lesson comes from
            </span>
            <ChevronDown size={18} className={showSource ? "rotate" : ""} />
          </button>
          {showSource && (
            <div className="source-detail">
              <strong>{c.source.title}</strong>
              <p>{c.source.section}</p>
              <p>
                The local lesson is an original explanation based on this
                reference. Generated explanations, when enabled, use the
                reviewed lesson as context.
              </p>
              <a
                className="text-link"
                href={c.source.url}
                target="_blank"
                rel="noreferrer"
              >
                Open official reference
                <ExternalLink size={15} />
              </a>
            </div>
          )}
          <div className="lesson-actions">
            {plan.status === "assigned" ? (
              <button
                className="button primary"
                disabled={!!busy}
                onClick={() => act("read")}
              >
                <CheckCircle2 size={19} />
                I’ve reviewed the lesson
                <ArrowRight size={18} />
              </button>
            ) : (
              <span className="read-confirmation">
                <CheckCircle2 size={18} />
                Lesson reviewed
              </span>
            )}
            <span>You control the pace. There is no timer.</span>
          </div>
        </article>
        <aside className="lesson-sidebar">
          <section className="panel next-step">
            <div className="eyebrow">YOUR NEXT STEP</div>
            <h2>
              {completed
                ? "What does the evidence say?"
                : "Put the idea into practice."}
            </h2>
            <p>
              {completed
                ? "This immediate retest shows how the student answered now. Long-term retention still needs a later check."
                : "Try the concept with feedback, then complete three different questions without hints."}
            </p>
            {result && (
              <div
                className={
                  "result-mini " +
                  (result.correct === result.total ? "success" : "warning")
                }
              >
                <strong>
                  {result.correct}/{result.total}
                </strong>
                <span>independent answers correct</span>
              </div>
            )}
            <button
              className="button secondary full"
              disabled={!!busy || plan.status === "assigned"}
              onClick={() => act("practice")}
            >
              <Lightbulb size={18} />
              Practice with feedback
              <ArrowRight size={17} />
            </button>
            <button
              className="button primary full"
              disabled={!!busy || plan.status === "assigned"}
              onClick={() => act("retest")}
            >
              <ListChecks size={18} />
              {completed ? "View retest result" : "Take independent retest"}
              <ArrowRight size={17} />
            </button>
            {plan.status === "needs_support" && (
              <button
                className="button secondary full"
                disabled={!!busy}
                onClick={() => act("review")}
              >
                <MessageSquare size={18} />
                Request mentor review
              </button>
            )}
            {plan.status === "assigned" && (
              <small>Review the lesson first to unlock your next step.</small>
            )}
            <div className="side-note">
              <ShieldCheck size={19} />
              <span>
                Practice answers don’t increase the independent evidence score.
              </span>
            </div>
          </section>
          <section className="panel evidence-compare">
            <h3>Evidence snapshot</h3>
            <div>
              <span>Before this plan</span>
              <strong>
                {plan.baseline === null ? "Not assessed" : plan.baseline + "%"}
              </strong>
            </div>
            <div>
              <span>Current estimate</span>
              <strong>
                {plan.current.score === null
                  ? "Not assessed"
                  : plan.current.score + "%"}
              </strong>
            </div>
            <p>
              {plan.current.count} recent independent responses. This is a
              transparent estimate, not a prediction of exam marks.
            </p>
          </section>
          {data.ai.enabled && (
            <section className="panel ai-card">
              <Sparkles size={23} />
              <h3>A different explanation?</h3>
              <p>
                Ask the free-tier model to explain the same approved material in
                another way.
              </p>
              <button
                className="button secondary full"
                disabled={!!busy || plan.mode === "generated"}
                onClick={() => act("personalize")}
              >
                {busy === "personalize" ? (
                  <span className="spinner small" />
                ) : (
                  <Sparkles size={17} />
                )}
                Personalize explanation
              </button>
            </section>
          )}
          <Link className="text-link" to={"/students/" + plan.student_id}>
            Return to student profile
            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </>
  );
}

function Quiz() {
  const { qid } = useParams(),
    navigate = useNavigate();
  const { data, reload, toast } = useApp();
  const [session, setSession] = useState<any>(null),
    [index, setIndex] = useState(0),
    [selection, setSelection] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [err, setErr] = useState(""),
    [summary, setSummary] = useState(false);
  useEffect(() => {
    api("/sessions/" + qid)
      .then((s) => {
        setSession(s);
        setIndex(Math.min(s.answered, s.total - 1));
        setSummary(!!s.completed_at);
      })
      .catch((e) => setErr(e.message));
  }, [qid]);
  if (err) return <Empty title="Assessment unavailable" description={err} />;
  if (!session) return <Loading />;
  const student = data.students.find((s) => s.id === session.student_id)!;
  const concept = data.concepts.find((c) => c.id === session.concept_id)!;
  const q = session.questions[index];
  const kind =
    session.phase === "retest"
      ? "Independent retest"
      : session.phase === "practice"
        ? "Guided practice"
        : "Quick diagnostic";
  const submit = async () => {
    if (selection === null) return;
    setBusy(true);
    try {
      const s = await api("/sessions/" + qid + "/answers", {
        question_id: q.id,
        answer: selection,
      });
      setSession(s);
      await reload();
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const next = () => {
    if (index < session.total - 1) {
      setIndex(index + 1);
      setSelection(null);
    } else setSummary(true);
  };
  const nextPlan = async () => {
    setBusy(true);
    try {
      const p = await api("/interventions", {
        student_id: session.student_id,
        concept_id: session.concept_id,
      });
      await reload();
      navigate("/learn/" + p.id);
    } catch (e) {
      toast((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="assessment-page">
      <Back
        to={
          session.intervention_id
            ? "/learn/" + session.intervention_id
            : "/students/" + session.student_id
        }
        label={
          session.intervention_id
            ? "Back to learning plan"
            : "Back to student profile"
        }
      />
      <div className="assessment-header">
        <div>
          <div className="eyebrow">
            {student.name.toUpperCase()} · {concept.title.toUpperCase()}
          </div>
          <h1>{kind}</h1>
          <p>
            {session.phase === "retest"
              ? "A fresh set of questions. Your own understanding. No hints."
              : session.phase === "practice"
                ? "Take your time. Feedback will help you understand each answer."
                : "A short check to see where your understanding stands."}
          </p>
        </div>
        <Badge band="neutral">
          <ShieldCheck size={14} />
          {session.phase === "practice"
            ? "Practice only"
            : "Independent evidence"}
        </Badge>
      </div>
      {summary ? (
        <section className="panel quiz-summary">
          <span
            className={
              "summary-icon " +
              (session.correct === session.total ? "success" : "warning")
            }
          >
            {session.correct === session.total ? (
              <CheckCircle2 size={37} />
            ) : (
              <Lightbulb size={37} />
            )}
          </span>
          <div className="eyebrow">{kind.toUpperCase()} COMPLETE</div>
          <h2>
            {session.correct === session.total
              ? "That idea is starting to click."
              : "Every answer tells us where to help."}
          </h2>
          <p>
            {session.phase === "practice"
              ? "This practice session is complete. Use an independent retest to check what you can do without help."
              : session.correct === session.total
                ? "All answers in this check were correct. The evidence has been saved to the student profile."
                : "Your responses are saved. We can use them to choose the next explanation and support."}
          </p>
          <div className="summary-score">
            <strong>
              {session.correct}
              <span>/{session.total}</span>
            </strong>
            <span>questions answered correctly</span>
          </div>
          <div className="summary-questions">
            {session.questions.map((x: any, i: number) => (
              <details key={x.id}>
                <summary>
                  <span>Question {i + 1}</span>
                  <Badge band={x.result?.correct ? "on_track" : "watch"}>
                    {x.result?.correct ? "Correct" : "Review needed"}
                  </Badge>
                  <ChevronDown size={16} />
                </summary>
                <p>{x.prompt}</p>
                <pre>{x.code}</pre>
                <p>
                  <strong>Correct output: </strong>
                  {x.options[x.result?.answer]}
                </p>
                <p>{x.result?.explanation}</p>
              </details>
            ))}
          </div>
          <div className="summary-actions">
            {session.intervention_id ? (
              <Link
                className="button primary"
                to={"/learn/" + session.intervention_id}
              >
                {session.phase === "practice"
                  ? "Continue to independent retest"
                  : "View updated learning plan"}
                <ArrowRight size={18} />
              </Link>
            ) : (
              <button
                className="button primary"
                disabled={busy}
                onClick={nextPlan}
              >
                Open targeted lesson
                <ArrowRight size={18} />
              </button>
            )}
            <Link
              className="button secondary"
              to={"/students/" + session.student_id}
            >
              View student evidence
            </Link>
          </div>
          <small>
            {session.phase === "retest"
              ? "Immediate performance is not proof of long-term retention. A later check is still needed."
              : "Your progress is saved locally on this device."}
          </small>
        </section>
      ) : (
        <section className="panel quiz-panel">
          <div className="quiz-progress">
            <span>
              Question {index + 1} of {session.total}
            </span>
            <span>{session.answered} answered</span>
            <div>
              {session.questions.map((x: any, i: number) => (
                <span
                  className={x.result ? "done" : index === i ? "current" : ""}
                  key={x.id}
                />
              ))}
            </div>
          </div>
          <h2>{q.prompt}</h2>
          {q.code && (
            <div className="code-block">
              <div>
                <span>
                  <Code2 size={16} />
                  PYTHON
                </span>
                <span>Trace the output</span>
              </div>
              <pre>{q.code}</pre>
            </div>
          )}
          <div
            className="answer-options"
            role="radiogroup"
            aria-label="Choose an answer"
          >
            {q.options.map((option: string, i: number) => {
              const r = q.result;
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={(r ? r.selected : selection) === i}
                  disabled={!!r || busy}
                  className={
                    "answer-option " +
                    ((r ? r.selected : selection) === i ? "selected " : "") +
                    (r && !r.pending && r.answer === i
                      ? "correct "
                      : r && !r.pending && r.selected === i
                        ? "incorrect"
                        : "")
                  }
                  onClick={() => setSelection(i)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <pre>{option}</pre>
                  {r && !r.pending && r.answer === i ? (
                    <CheckCircle2 size={21} />
                  ) : r && !r.pending && r.selected === i ? (
                    <X size={21} />
                  ) : (
                    <span className="radio-indicator" />
                  )}
                </button>
              );
            })}
          </div>
          {q.result?.pending && (
            <div className="answer-feedback recorded">
              <ShieldCheck size={22} />
              <div>
                <strong>Answer saved.</strong>
                <p>
                  Feedback appears after the final question so this remains an
                  independent check.
                </p>
              </div>
            </div>
          )}
          {q.result && !q.result.pending && (
            <div
              className={
                "answer-feedback " + (q.result.correct ? "success" : "warning")
              }
            >
              <span>
                {q.result.correct ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <Lightbulb size={22} />
                )}
              </span>
              <div>
                <strong>
                  {q.result.correct
                    ? "Correct. Here’s why."
                    : "Let’s look at the reasoning."}
                </strong>
                <p>{q.result.explanation}</p>
              </div>
            </div>
          )}
          <div className="quiz-actions">
            <span>
              <Database size={16} />
              Responses save automatically
            </span>
            {q.result ? (
              <button className="button primary" onClick={next}>
                {index === session.total - 1
                  ? "See my results"
                  : "Next question"}
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="button primary"
                disabled={selection === null || busy}
                onClick={submit}
              >
                {busy ? (
                  <span className="spinner small" />
                ) : (
                  <Check size={18} />
                )}
                Submit answer
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function Insights() {
  const { data } = useApp();
  return (
    <>
      <PageTitle
        eyebrow="THE BIGGER PICTURE"
        title="Class insights"
        description="Find shared gaps and decide where a short class explanation could help."
        actions={
          <a className="button secondary" href="/api/export">
            <ArrowDownToLine size={18} />
            Export evidence
          </a>
        }
      />
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Concept evidence map</h2>
            <p>
              Each cell shows a student’s evidence estimate. Blank cells mean
              not assessed.
            </p>
          </div>
        </div>
        <div className="table-scroll heatmap-scroll">
          <table className="heatmap">
            <thead>
              <tr>
                <th>Student</th>
                {data.concepts.map((c) => (
                  <th key={c.id}>{c.title}</th>
                ))}
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link to={"/students/" + s.id} className="student-cell">
                      <Avatar student={s} />
                      <strong>{s.name}</strong>
                    </Link>
                  </td>
                  {data.concepts.map((c) => {
                    const e = s.evidence[c.id];
                    return (
                      <td key={c.id}>
                        <Link
                          title={`${e.correct} of ${e.count} independent answers correct`}
                          className={
                            "heat-cell " +
                            (e.score === null
                              ? "empty-cell"
                              : e.score < 40
                                ? "low"
                                : e.score < 65
                                  ? "mid"
                                  : "good")
                          }
                          to={"/students/" + s.id}
                        >
                          {e.score === null ? "—" : e.score + "%"}
                        </Link>
                      </td>
                    );
                  })}
                  <td>
                    <Badge band={s.band} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="concept-summary-grid">
        {data.concepts.map((c) => {
          const scores = data.students
            .map((s) => s.evidence[c.id].score)
            .filter((x) => x !== null) as number[];
          return (
            <section className="panel concept-summary" key={c.id}>
              <BookOpen size={23} />
              <h3>{c.title}</h3>
              <strong>
                {scores.length
                  ? Math.round(
                      scores.reduce((a, b) => a + b, 0) / scores.length,
                    ) + "%"
                  : "—"}
              </strong>
              <p>
                Average evidence estimate · {scores.length} assessed students
              </p>
              <span>
                {scores.filter((s) => s < 40).length} students have an estimate
                below 40%
              </span>
            </section>
          );
        })}
      </div>
      <div className="info-banner">
        <CircleHelp size={21} />
        <p>
          Concept estimates summarize recent independent responses. Use them to
          plan support; a later assessment is needed to check long-term
          retention.
        </p>
      </div>
    </>
  );
}

function Reviews() {
  const { data, reload, toast } = useApp();
  const [filter, setFilter] = useState("open"),
    [busy, setBusy] = useState("");
  const rows = data.reviews.filter(
    (r) => filter === "all" || r.status === filter,
  );
  return (
    <>
      <PageTitle
        eyebrow="HUMAN SUPPORT MATTERS"
        title="Mentor review"
        description="When a learning gap persists, bring a person into the loop."
      />
      <div className="page-tabs">
        {[
          ["open", "Needs review"],
          ["acknowledged", "Acknowledged"],
          ["all", "All reviews"],
        ].map(([v, l]) => (
          <button
            className={filter === v ? "active" : ""}
            key={v}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>
      {rows.length ? (
        rows.map((r) => {
          const s = data.students.find((s) => s.id === r.student_id)!;
          return (
            <section className="panel review-card" key={r.id}>
              <div className="review-top">
                <div className="student-cell">
                  <Avatar student={s} size="large" />
                  <div>
                    <h2>{s.name}</h2>
                    <p>
                      {data.concepts.find((c) => c.id === r.concept_id)?.title}
                    </p>
                  </div>
                </div>
                <Badge band={r.status === "open" ? "watch" : "on_track"}>
                  {r.status === "open"
                    ? "Needs a conversation"
                    : "Acknowledged"}
                </Badge>
              </div>
              <p>{r.reason}</p>
              <div className="review-actions">
                <Link className="button secondary" to={"/students/" + s.id}>
                  Inspect learning evidence
                  <ArrowRight size={17} />
                </Link>
                {r.status === "open" && (
                  <button
                    className="button primary"
                    disabled={!!busy}
                    onClick={async () => {
                      setBusy(r.id);
                      try {
                        await api("/reviews/" + r.id + "/acknowledge", {});
                        await reload();
                        toast(
                          "Review acknowledged. No message or email was sent.",
                        );
                      } catch (e) {
                        toast((e as Error).message);
                      } finally {
                        setBusy("");
                      }
                    }}
                  >
                    <Check size={17} />
                    Acknowledge review
                  </button>
                )}
              </div>
            </section>
          );
        })
      ) : (
        <section className="panel">
          <Empty
            title="Nothing waiting here"
            description="Reviews appear when repeated difficulty needs a mentor’s attention."
          />
        </section>
      )}
      <div className="info-banner">
        <MessageSquare size={22} />
        <p>
          Reviews stay inside this local workspace. Acknowledging an item
          records that you have seen it; it does not send a message or mark the
          student’s difficulty resolved.
        </p>
      </div>
    </>
  );
}

function Sources() {
  const { data } = useApp();
  return (
    <>
      <PageTitle
        eyebrow="GROUNDED IN THE COURSE"
        title="Course library"
        description="A small, reviewed curriculum. Every explanation has a reference."
      />
      <div className="course-banner">
        <span className="course-icon">
          <Code2 size={28} />
        </span>
        <div>
          <h2>{data.course.title}</h2>
          <p>
            3 concepts · 24 checked questions · English · Introductory
            programming
          </p>
        </div>
        <Badge band="on_track">
          <ShieldCheck size={15} />
          Reviewed content
        </Badge>
      </div>
      <div className="source-grid">
        {data.concepts.map((c, i) => (
          <section className="panel source-card" key={c.id}>
            <div className="source-card-top">
              <span>0{i + 1}</span>
              <FileText size={24} />
            </div>
            <h2>{c.title}</h2>
            <p>{c.description}</p>
            <div className="source-reference">
              <strong>{c.source.title}</strong>
              <p>{c.source.section}</p>
              <a
                className="text-link"
                target="_blank"
                rel="noreferrer"
                href={c.source.url}
              >
                Official Python reference
                <ExternalLink size={15} />
              </a>
            </div>
            <div className="source-counts">
              <span>2 diagnostic</span>
              <span>3 practice</span>
              <span>3 retest</span>
            </div>
          </section>
        ))}
      </div>
      <section className="panel library-note">
        <h2>How material is used</h2>
        <div className="three-columns">
          <div>
            <span>01</span>
            <h3>Retrieve by concept</h3>
            <p>
              The identified gap selects the relevant reviewed lesson. There is
              no unrestricted web search.
            </p>
          </div>
          <div>
            <span>02</span>
            <h3>Keep the source visible</h3>
            <p>
              Students can inspect the teaching reference. Optional AI rephrases
              the approved material.
            </p>
          </div>
          <div>
            <span>03</span>
            <h3>Check independently</h3>
            <p>
              Reviewed answer keys grade the retest. Generated text never
              decides whether a student is correct.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Settings() {
  const { data, reload, toast } = useApp();
  const a = data.ai;
  return (
    <>
      <PageTitle
        eyebrow="YOUR WORKSPACE"
        title="Workspace settings"
        description="Connection status, local storage, and resource usage."
        actions={
          <button
            className="button secondary"
            onClick={async () => {
              await reload();
              toast("Workspace status refreshed.");
            }}
          >
            <RefreshCw size={17} />
            Refresh status
          </button>
        }
      />
      <div className="settings-grid">
        <section className="panel settings-card">
          <div className="settings-card-heading">
            <span className="setting-icon">
              <ShieldCheck size={25} />
            </span>
            <div>
              <h2>Classroom workspace</h2>
              <p>Your learning records stay on this device.</p>
            </div>
            <Badge band="on_track">Active</Badge>
          </div>
          <dl>
            <div>
              <dt>Class</dt>
              <dd>CSE · Year 1</dd>
            </div>
            <div>
              <dt>Students</dt>
              <dd>{data.students.length} enrolled</dd>
            </div>
            <div>
              <dt>Course</dt>
              <dd>Python Foundations</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>Local SQLite database</dd>
            </div>
            <div>
              <dt>Content</dt>
              <dd>Reviewed lessons and answer keys</dd>
            </div>
            <div>
              <dt>Cloud explanations</dt>
              <dd>
                {a.enabled ? "Free-tier connection configured" : "Disabled"}
              </dd>
            </div>
          </dl>
          <div className="info-banner compact">
            <WifiOff size={21} />
            <p>
              Lessons, questions, grading, and saved progress work without
              internet.
            </p>
          </div>
        </section>
        <section className="panel settings-card">
          <div className="settings-card-heading">
            <span className="setting-icon blue">
              <Sparkles size={24} />
            </span>
            <div>
              <h2>AI allowance</h2>
              <p>Persistent usage limits.</p>
            </div>
          </div>
          <div className="usage-metrics">
            <div>
              <strong>
                {a.daily_calls}
                <small> / {a.limits.calls}</small>
              </strong>
              <span>Requests in the last 24 hours</span>
            </div>
            <div>
              <strong>
                {a.daily_tokens.toLocaleString()}
                <small> / 50k</small>
              </strong>
              <span>Tokens used or reserved today</span>
            </div>
          </div>
          <dl>
            <div>
              <dt>Lifetime token ceiling</dt>
              <dd>{a.lifetime_tokens.toLocaleString()} / 100,000</dd>
            </div>
            <div>
              <dt>Input / output ceiling</dt>
              <dd>2,000 / 800 tokens</dd>
            </div>
            <div>
              <dt>Concurrency / rate</dt>
              <dd>1 active / 2 requests per minute</dd>
            </div>
            <div>
              <dt>Automatic retries</dt>
              <dd>None</dd>
            </div>
            <div>
              <dt>Paid fallback</dt>
              <dd>Not available</dd>
            </div>
          </dl>
          <p className="settings-note">
            Reviewed teaching material remains available whenever cloud
            explanations are disabled or unavailable.
          </p>
        </section>
      </div>
    </>
  );
}

function Presenter() {
  const [active, setActive] = useState(0);
  const { data } = useApp();
  const script = presentationSections;
  return (
    <>
      <PageTitle
        eyebrow="YOUR TWELVE-MINUTE PRESENTATION"
        title="Tell the story. Show the evidence."
        description="A classroom story, four learning paths, panel participation, and your technology explanation."
        actions={
          <button className="button secondary" onClick={() => window.print()}>
            <FileText size={17} />
            Print notes
          </button>
        }
      />
      <div className="info-banner">
        <CircleHelp size={21} />
        <p>
          Use “reviewed local lesson” in the pitch unless live generation is
          actually enabled. Current mode:{" "}
          <strong>
            {data.ai.enabled
              ? "free-tier connection configured"
              : "local reviewed content"}
          </strong>
          . Confirm organizer permission for AI-assisted development and APIs.
        </p>
      </div>
      <div className="presenter-grid">
        <nav className="script-nav" aria-label="Speaker note sections">
          {script.map(([title, time], i) => (
            <button
              key={title}
              onClick={() => setActive(i)}
              className={i === active ? "active" : ""}
            >
              <span>{i + 1}</span>
              <div>
                <strong>{title}</strong>
                <small>{time}</small>
              </div>
              <ChevronRight size={17} />
            </button>
          ))}
        </nav>
        <section className="panel script-card">
          <div className="script-heading">
            <Badge band="blue">{script[active][1]}</Badge>
            <span>
              PART {active + 1} OF {script.length}
            </span>
          </div>
          <h2>{script[active][0]}</h2>
          <blockquote>{script[active][2]}</blockquote>
          <div className="stage-direction">
            <Play size={20} />
            <div>
              <strong>On screen</strong>
              <p>{script[active][3]}</p>
            </div>
          </div>
          <div className="script-controls">
            <button
              className="button secondary"
              disabled={active === 0}
              onClick={() => setActive(active - 1)}
            >
              <ArrowLeft size={17} />
              Previous
            </button>
            <button
              className="button primary"
              disabled={active === script.length - 1}
              onClick={() => setActive(active + 1)}
            >
              Next section
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
      <section className="panel jury-questions">
        <h2>Be ready for these questions</h2>
        {[
          [
            "What makes this different?",
            "The contribution is the implemented workflow: visible concept evidence, source-backed remediation, independent verification, and mentor follow-up in one local tool. Tutoring and adaptive practice already exist; I am not claiming those ideas are new.",
          ],
          [
            "Where is the AI?",
            "The current local path uses deterministic assessment and reviewed content. The optional model adapts explanations from that content. I deliberately keep answer grading and priority calculation reproducible.",
          ],
          [
            "How accurate is your risk prediction?",
            "I have not validated a failure-prediction model. This prototype uses an explainable support-priority heuristic. Real predictive accuracy needs suitable historical outcomes and held-out evaluation.",
          ],
          [
            "Does it improve marks?",
            "That has not been established. This demo records immediate retest performance. A pilot, comparison condition, and delayed test are needed before claiming learning gains.",
          ],
          [
            "What did you build?",
            "I developed and integrated the student and faculty workflow, local persistence, assessment logic, lesson delivery, and demonstration. I used open-source libraries and AI assistance where permitted, and I can explain each component.",
          ],
          [
            "What if the internet fails?",
            "The reviewed lessons, question bank, deterministic grading, and SQLite progress continue locally. Only optional live rephrasing needs an internet connection.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="panel fallback-script">
        <h2>If you only have 60 seconds</h2>
        <p>
          “Meet Asha, a fictional student who attends class but struggles with
          nested loops. EduPulse shows the evidence behind that gap, chooses a
          focused lesson, and checks understanding with different questions.
          Watch this answer being saved and the faculty view updating. The core
          flow runs locally on Windows without an API bill. These are synthetic
          records, and learning gains are not yet validated. The next step is a
          supervised classroom pilot. EduPulse helps faculty turn a learning
          signal into a clear, timely action.”
        </p>
      </section>
      <div className="print-notes">
        {script.map(([title, time, words, direction]) => (
          <section key={title}>
            <h2>
              {time} · {title}
            </h2>
            <p>{words}</p>
            <p>
              <strong>On screen:</strong> {direction}
            </p>
          </section>
        ))}
      </div>
    </>
  );
}
