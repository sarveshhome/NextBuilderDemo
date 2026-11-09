"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  guardian: string;
  phone: string;
  status: "Active" | "Inactive";
  fee: number;
  paid: number;
};

type SchoolClass = {
  id: string;
  name: string;
  teacher: string;
  room: string;
  capacity: number;
  color: string;
};

type Section = "Overview" | "Students" | "Payments" | "Classes";

const initialStudents: Student[] = [
  { id: "ST-2024", name: "Olivia Rhye", email: "olivia.rhye@email.com", grade: "Grade 8", section: "A", guardian: "Catherine Rhye", phone: "+1 (555) 013-2845", status: "Active", fee: 1200, paid: 1200 },
  { id: "ST-2023", name: "Phoenix Baker", email: "phoenix.baker@email.com", grade: "Grade 7", section: "B", guardian: "James Baker", phone: "+1 (555) 018-3921", status: "Active", fee: 1200, paid: 600 },
  { id: "ST-2022", name: "Lana Steiner", email: "lana.steiner@email.com", grade: "Grade 9", section: "A", guardian: "Marcus Steiner", phone: "+1 (555) 017-0432", status: "Active", fee: 1400, paid: 1400 },
  { id: "ST-2021", name: "Demi Wilkinson", email: "demi.wilkinson@email.com", grade: "Grade 6", section: "C", guardian: "Leah Wilkinson", phone: "+1 (555) 014-6682", status: "Active", fee: 1000, paid: 0 },
  { id: "ST-2020", name: "Candice Wu", email: "candice.wu@email.com", grade: "Grade 8", section: "B", guardian: "Arthur Wu", phone: "+1 (555) 011-7354", status: "Active", fee: 1200, paid: 1200 },
  { id: "ST-2019", name: "Natali Craig", email: "natali.craig@email.com", grade: "Grade 7", section: "A", guardian: "Sophie Craig", phone: "+1 (555) 016-4090", status: "Inactive", fee: 1200, paid: 1200 },
];

const initialClasses: SchoolClass[] = [
  { id: "CLS-01", name: "Grade 6", teacher: "Wade Warren", room: "Room 104", capacity: 30, color: "lavender" },
  { id: "CLS-02", name: "Grade 7", teacher: "Esther Howard", room: "Room 208", capacity: 28, color: "mint" },
  { id: "CLS-03", name: "Grade 8", teacher: "Cody Fisher", room: "Room 112", capacity: 32, color: "peach" },
  { id: "CLS-04", name: "Grade 9", teacher: "Brooklyn Simmons", room: "Room 301", capacity: 26, color: "blue" },
];

const navItems: { label: Section; icon: string }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Students", icon: "users" },
  { label: "Payments", icon: "card" },
  { label: "Classes", icon: "book" },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M7 15h3" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    down: <><path d="m7 10 5 5 5-5" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
  };

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.grid}</svg>;
}

function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`avatar ${className}`} aria-hidden="true">{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function SchoolDashboard() {
  const [section, setSection] = useState<Section>("Overview");
  const [students, setStudents] = useState(initialStudents);
  const [classes, setClasses] = useState(initialClasses);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"student" | "class" | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  const filteredStudents = useMemo(() => students.filter((student) =>
    `${student.name} ${student.id} ${student.grade} ${student.email}`.toLowerCase().includes(query.toLowerCase()),
  ), [students, query]);

  const collected = students.reduce((sum, student) => sum + student.paid, 0);
  const expected = students.reduce((sum, student) => sum + student.fee, 0);
  const activeStudents = students.filter((student) => student.status === "Active").length;
  const outstanding = students.filter((student) => student.paid < student.fee).length;

  function addStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("name"));
    const grade = String(form.get("grade"));
    const nextId = `ST-${2025 + students.length - initialStudents.length}`;
    setStudents((current) => [{
      id: nextId,
      name: fullName,
      email: String(form.get("email")),
      grade,
      section: String(form.get("section")),
      guardian: String(form.get("guardian")),
      phone: String(form.get("phone")),
      status: "Active",
      fee: grade === "Grade 9" ? 1400 : grade === "Grade 6" ? 1000 : 1200,
      paid: 0,
    }, ...current]);
    setModal(null);
    setSection("Students");
  }

  function addClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    setClasses((current) => [...current, {
      id: `CLS-${String(current.length + 1).padStart(2, "0")}`,
      name,
      teacher: String(form.get("teacher")),
      room: String(form.get("room")),
      capacity: Number(form.get("capacity")),
      color: ["lavender", "mint", "peach", "blue"][current.length % 4],
    }]);
    setModal(null);
    setSection("Classes");
  }

  function recordPayment(studentId: string) {
    setStudents((current) => current.map((student) => student.id === studentId ? { ...student, paid: student.fee } : student));
  }

  const title: Record<Section, string> = {
    Overview: "Good morning",
    Students: "Students",
    Payments: "Payments",
    Classes: "Classes & grades",
  };

  return (
    <div className="school-app">
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); setSection("Overview"); setMobileNav(false); }}>
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span>northstar<span className="brand-dot">.</span><small>ACADEMY</small></span>
        </a>
        <div className="school-switcher">
          <span className="school-avatar">N</span>
          <span className="switcher-copy"><strong>Northstar Academy</strong><small>School workspace</small></span>
          <Icon name="down" size={16} />
        </div>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${section === item.label ? "nav-item-active" : ""}`} onClick={() => { setSection(item.label); setMobileNav(false); }}>
              <Icon name={item.icon} /><span>{item.label}</span>
              {item.label === "Students" && <span className="nav-count">{students.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-icon">?</span><strong>Need a hand?</strong><p>Visit our help center for tips and guides.</p><button onClick={() => setSection("Overview")}>Visit help center <Icon name="arrow" size={14} /></button></div>
          <button className="profile-button"><Avatar name="Alex Morgan" className="profile-avatar" /><span><strong>Alex Morgan</strong><small>Administrator</small></span><Icon name="more" size={17} /></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Icon name="menu" /></button>
          <div className="breadcrumb">Workspace <Icon name="chevron" size={14} /> <strong>{section}</strong></div>
          <div className="topbar-actions">
            <label className="global-search"><Icon name="search" size={17} /><input aria-label="Search students" placeholder="Search anything..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={19} /><i /></button>
            <Avatar name="Alex Morgan" className="top-avatar" />
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow">MONDAY, OCTOBER 21, 2024 <span className="live-dot" /></div><h1>{title[section]}{section === "Overview" && <span className="wave">, Alex</span>}</h1><p>{section === "Overview" ? "Here’s what’s happening at your school today." : section === "Students" ? "Manage your students and keep their information up to date." : section === "Payments" ? "Keep track of tuition, invoices, and outstanding balances." : "Organize your grades, classrooms, and teaching staff."}</p></div>
            <div className="heading-actions"><button className="button button-secondary" onClick={() => setSection("Payments")}><Icon name="calendar" size={16} /> This month <Icon name="down" size={14} /></button><button className="button button-primary" onClick={() => setModal(section === "Classes" ? "class" : "student")}><Icon name="plus" size={17} /> {section === "Classes" ? "Add class" : "Add student"}</button></div>
          </div>

          {section === "Overview" && <Overview students={students} classes={classes} activeStudents={activeStudents} collected={collected} expected={expected} outstanding={outstanding} onStudentClick={setSelectedStudent} onNavigate={setSection} />}
          {section === "Students" && <StudentList students={filteredStudents} query={query} onAdd={() => setModal("student")} onSelect={setSelectedStudent} />}
          {section === "Payments" && <Payments students={students} collected={collected} expected={expected} outstanding={outstanding} onRecord={recordPayment} />}
          {section === "Classes" && <ClassList classes={classes} students={students} onAdd={() => setModal("class")} />}
        </div>
      </main>

      {(modal || selectedStudent) && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setModal(null); setSelectedStudent(null); } }}>
        {modal === "student" && <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="student-modal-title"><div className="modal-heading"><div><span className="modal-icon"><Icon name="users" size={19} /></span><h2 id="student-modal-title">Add a student</h2><p>Enter the student’s details to add them to your school.</p></div><button className="icon-button" onClick={() => setModal(null)} aria-label="Close"><Icon name="close" /></button></div><form onSubmit={addStudent}><div className="form-grid"><label className="form-field span-two">Student name<input name="name" placeholder="e.g. Jordan Lee" required autoFocus /></label><label className="form-field">Email address<input name="email" type="email" placeholder="student@email.com" required /></label><label className="form-field">Grade<select name="grade" defaultValue="Grade 8">{["Grade 6", "Grade 7", "Grade 8", "Grade 9"].map((grade) => <option key={grade}>{grade}</option>)}</select></label><label className="form-field">Section<select name="section" defaultValue="A"><option>A</option><option>B</option><option>C</option></select></label><label className="form-field">Parent / guardian<input name="guardian" placeholder="Guardian’s name" required /></label><label className="form-field span-two">Guardian phone<input name="phone" type="tel" placeholder="+1 (555) 000-0000" required /></label></div><div className="modal-footer"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary" type="submit"><Icon name="plus" size={16} /> Add student</button></div></form></section>}
        {modal === "class" && <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="class-modal-title"><div className="modal-heading"><div><span className="modal-icon"><Icon name="book" size={19} /></span><h2 id="class-modal-title">Create a class</h2><p>Set up a grade and assign a teacher.</p></div><button className="icon-button" onClick={() => setModal(null)} aria-label="Close"><Icon name="close" /></button></div><form onSubmit={addClass}><div className="form-grid"><label className="form-field span-two">Class name<input name="name" placeholder="e.g. Grade 10" required autoFocus /></label><label className="form-field span-two">Teacher<input name="teacher" placeholder="Teacher’s full name" required /></label><label className="form-field">Room<input name="room" placeholder="e.g. Room 302" required /></label><label className="form-field">Capacity<input name="capacity" type="number" min="1" max="60" defaultValue="30" required /></label></div><div className="modal-footer"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary" type="submit"><Icon name="plus" size={16} /> Create class</button></div></form></section>}
        {selectedStudent && <section className="modal-card student-detail" role="dialog" aria-modal="true" aria-labelledby="student-detail-title"><div className="modal-heading"><div className="detail-person"><Avatar name={selectedStudent.name} className="detail-avatar" /><div><h2 id="student-detail-title">{selectedStudent.name}</h2><p>{selectedStudent.id} <span className="detail-separator">·</span> {selectedStudent.grade} — Section {selectedStudent.section}</p></div></div><button className="icon-button" onClick={() => setSelectedStudent(null)} aria-label="Close"><Icon name="close" /></button></div><div className="detail-status"><span className={`status-pill ${selectedStudent.status === "Active" ? "status-active" : "status-inactive"}`}><i />{selectedStudent.status}</span></div><div className="detail-grid"><div><small>Email address</small><strong>{selectedStudent.email}</strong></div><div><small>Parent / guardian</small><strong>{selectedStudent.guardian}</strong></div><div><small>Guardian phone</small><strong>{selectedStudent.phone}</strong></div><div><small>Tuition status</small><strong>{formatCurrency(selectedStudent.paid)} of {formatCurrency(selectedStudent.fee)} paid</strong></div></div><div className="modal-footer"><button className="button button-secondary" onClick={() => setSelectedStudent(null)}>Close</button>{selectedStudent.paid < selectedStudent.fee && <button className="button button-primary" onClick={() => { recordPayment(selectedStudent.id); setSelectedStudent(null); setSection("Payments"); }}>Record payment</button>}</div></section>}
      </div>}
    </div>
  );
}

function Overview({ students, classes, activeStudents, collected, expected, outstanding, onStudentClick, onNavigate }: {
  students: Student[]; classes: SchoolClass[]; activeStudents: number; collected: number; expected: number; outstanding: number;
  onStudentClick: (student: Student) => void; onNavigate: (section: Section) => void;
}) {
  const metrics = [
    { label: "Total students", value: String(activeStudents).padStart(2, "0"), change: "+12.5%", note: "vs. last month", icon: "users", color: "metric-purple" },
    { label: "Fee collected", value: formatCurrency(collected), change: `${Math.round((collected / Math.max(expected, 1)) * 100)}%`, note: "of total expected", icon: "card", color: "metric-green" },
    { label: "Outstanding fees", value: formatCurrency(expected - collected), change: `${outstanding} students`, note: "need attention", icon: "clock", color: "metric-orange" },
    { label: "Active classes", value: String(classes.length).padStart(2, "0"), change: "+2", note: "this semester", icon: "book", color: "metric-blue" },
  ];
  return <>
    <section className="metrics-grid">{metrics.map((metric) => <article className="metric-card" key={metric.label}><div className={`metric-icon ${metric.color}`}><Icon name={metric.icon} size={19} /></div><span className="metric-menu"><Icon name="more" size={17} /></span><p>{metric.label}</p><div className="metric-value">{metric.value}</div><div className="metric-note"><span>{metric.change}</span> {metric.note}</div></article>)}</section>
    <section className="dashboard-grid"><article className="panel enrollment-panel"><div className="panel-heading"><div><h2>Student enrollment</h2><p>Enrollment overview for this academic year</p></div><button className="select-button">This year <Icon name="down" size={14} /></button></div><div className="chart-legend"><span><i className="legend-dot legend-purple" />New students</span><span><i className="legend-dot legend-pale" />Returning students</span></div><div className="chart-area"><div className="chart-y-labels"><span>160</span><span>120</span><span>80</span><span>40</span><span>0</span></div><div className="chart-plot"><div className="chart-gridlines"><i /><i /><i /><i /><i /></div><div className="chart-bars">{[{ m: "Jan", a: 54, b: 69 }, { m: "Feb", a: 65, b: 78 }, { m: "Mar", a: 52, b: 89 }, { m: "Apr", a: 74, b: 91 }, { m: "May", a: 67, b: 79 }, { m: "Jun", a: 86, b: 96 }, { m: "Jul", a: 63, b: 82 }, { m: "Aug", a: 76, b: 91 }, { m: "Sep", a: 90, b: 78 }, { m: "Oct", a: 69, b: 88 }, { m: "Nov", a: 80, b: 94 }, { m: "Dec", a: 72, b: 84 }].map((bar) => <div className="bar-column" key={bar.m}><div className="bar-pair"><i className="bar bar-new" style={{ height: `${bar.a}%` }} /><i className="bar bar-returning" style={{ height: `${bar.b}%` }} /></div><span>{bar.m}</span></div>)}</div></div></div></article>
      <article className="panel schedule-panel"><div className="panel-heading"><div><h2>Today’s schedule</h2><p>Monday, October 21</p></div><button className="icon-button muted-icon" aria-label="More schedule options"><Icon name="more" /></button></div><div className="schedule-list"><div className="schedule-item"><time>08:30<span>AM</span></time><div className="schedule-mark mark-lavender" /><div className="schedule-copy"><strong>Morning assembly</strong><span>School auditorium</span></div><Avatar name="School Assembly" className="tiny-avatar avatar-lavender" /></div><div className="schedule-item"><time>10:00<span>AM</span></time><div className="schedule-mark mark-mint" /><div className="schedule-copy"><strong>Parent–teacher meeting</strong><span>Conference room · Grade 8</span></div><Avatar name="PT Meeting" className="tiny-avatar avatar-mint" /></div><div className="schedule-item"><time>01:15<span>PM</span></time><div className="schedule-mark mark-peach" /><div className="schedule-copy"><strong>Science fair planning</strong><span>Room 204 · Staff meeting</span></div><Avatar name="Science Fair" className="tiny-avatar avatar-peach" /></div><div className="schedule-item"><time>03:30<span>PM</span></time><div className="schedule-mark mark-blue" /><div className="schedule-copy"><strong>Basketball practice</strong><span>Sports ground · Grades 7–9</span></div><Avatar name="Basketball" className="tiny-avatar avatar-blue" /></div></div><button className="text-link schedule-link" onClick={() => onNavigate("Classes")}>View full schedule <Icon name="arrow" size={14} /></button></article></section>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recently added students</h2><p>Keep an eye on your latest enrollments</p></div><button className="text-link" onClick={() => onNavigate("Students")}>View all students <Icon name="arrow" size={14} /></button></div><StudentTable students={students.slice(0, 4)} onSelect={onStudentClick} compact /></section>
  </>;
}

function StudentList({ students, query, onAdd, onSelect }: { students: Student[]; query: string; onAdd: () => void; onSelect: (student: Student) => void }) {
  const [grade, setGrade] = useState("All grades");
  const shown = grade === "All grades" ? students : students.filter((student) => student.grade === grade);
  return <section className="panel table-panel"><div className="list-toolbar"><div><h2>All students <span className="count-badge">{students.length}</span></h2><p>A list of all students enrolled at Northstar Academy.</p></div><div className="table-filters"><select className="filter-select" aria-label="Filter by grade" value={grade} onChange={(event) => setGrade(event.target.value)}><option>All grades</option>{["Grade 6", "Grade 7", "Grade 8", "Grade 9"].map((item) => <option key={item}>{item}</option>)}</select><button className="button button-primary button-small" onClick={onAdd}><Icon name="plus" size={16} /> Add student</button></div></div>{shown.length ? <StudentTable students={shown} onSelect={onSelect} /> : <div className="empty-state"><span className="empty-icon"><Icon name="search" size={22} /></span><strong>No students found</strong><p>{query ? "Try a different search or grade filter." : "Add a student to get started."}</p></div>}</section>;
}

function StudentTable({ students, onSelect, compact = false }: { students: Student[]; onSelect: (student: Student) => void; compact?: boolean }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th><span className="check-box" /></th><th>Student</th><th>Student ID</th><th>Grade</th>{!compact && <th>Guardian</th>}<th>Status</th><th>Tuition</th><th /></tr></thead><tbody>{students.map((student) => <tr key={student.id} onClick={() => onSelect(student)}><td><span className="check-box" /></td><td><div className="student-cell"><Avatar name={student.name} /><span><strong>{student.name}</strong><small>{student.email}</small></span></div></td><td className="id-cell">{student.id}</td><td>{student.grade}<span className="section-sub"> · Section {student.section}</span></td>{!compact && <td><div className="guardian-cell">{student.guardian}<small>{student.phone}</small></div></td>}<td><span className={`status-pill ${student.status === "Active" ? "status-active" : "status-inactive"}`}><i />{student.status}</span></td><td><span className={`tuition-state ${student.paid >= student.fee ? "tuition-paid" : "tuition-due"}`}><i />{student.paid >= student.fee ? "Paid" : student.paid > 0 ? "Partial" : "Due"}</span></td><td><button className="row-more" aria-label={`View ${student.name}`} onClick={(event) => { event.stopPropagation(); onSelect(student); }}><Icon name="more" size={17} /></button></td></tr>)}</tbody></table></div>;
}

function Payments({ students, collected, expected, outstanding, onRecord }: { students: Student[]; collected: number; expected: number; outstanding: number; onRecord: (id: string) => void }) {
  const [filter, setFilter] = useState("All payments");
  const pendingStudents = students.filter((student) => student.paid < student.fee);
  const rows = filter === "Paid" ? students.filter((student) => student.paid >= student.fee) : filter === "Outstanding" ? pendingStudents : students;
  return <><section className="payment-summary"><article className="payment-stat"><span className="payment-stat-icon pay-green"><Icon name="check" size={18} /></span><span>Total collected</span><strong>{formatCurrency(collected)}</strong><small><i /> This academic year</small></article><article className="payment-stat"><span className="payment-stat-icon pay-orange"><Icon name="clock" size={18} /></span><span>Outstanding</span><strong>{formatCurrency(expected - collected)}</strong><small>{outstanding} students with a balance</small></article><article className="payment-stat"><span className="payment-stat-icon pay-blue"><Icon name="users" size={18} /></span><span>Collection rate</span><strong>{Math.round((collected / Math.max(expected, 1)) * 100)}%</strong><div className="progress-track"><i style={{ width: `${Math.round((collected / Math.max(expected, 1)) * 100)}%` }} /></div></article></section><section className="panel table-panel"><div className="list-toolbar"><div><h2>Tuition records <span className="count-badge">{rows.length}</span></h2><p>Review and update student fee payments.</p></div><div className="table-filters"><select className="filter-select" aria-label="Filter payments" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All payments</option><option>Paid</option><option>Outstanding</option></select><button className="button button-secondary button-small" onClick={() => window.print()}>Export report</button></div></div><div className="table-scroll"><table className="data-table payment-table"><thead><tr><th>Student</th><th>Student ID</th><th>Grade</th><th>Amount due</th><th>Amount paid</th><th>Balance</th><th>Status</th><th /></tr></thead><tbody>{rows.map((student) => <tr key={student.id}><td><div className="student-cell"><Avatar name={student.name} /><span><strong>{student.name}</strong><small>{student.email}</small></span></div></td><td className="id-cell">{student.id}</td><td>{student.grade}</td><td>{formatCurrency(student.fee)}</td><td>{formatCurrency(student.paid)}</td><td className={student.paid < student.fee ? "balance-due" : "balance-paid"}>{formatCurrency(student.fee - student.paid)}</td><td><span className={`tuition-state ${student.paid >= student.fee ? "tuition-paid" : "tuition-due"}`}><i />{student.paid >= student.fee ? "Paid" : student.paid > 0 ? "Partial" : "Due"}</span></td><td>{student.paid < student.fee ? <button className="record-button" onClick={() => onRecord(student.id)}>Record payment</button> : <span className="paid-check"><Icon name="check" size={16} /></span>}</td></tr>)}</tbody></table></div></section></>;
}

function ClassList({ classes, students, onAdd }: { classes: SchoolClass[]; students: Student[]; onAdd: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const colors: Record<string, string> = { lavender: "class-lavender", mint: "class-mint", peach: "class-peach", blue: "class-blue" };
  return <><section className="class-summary"><div><span className="class-summary-icon"><Icon name="book" size={19} /></span><strong>{classes.length}</strong><span>Active classes</span></div><div><span className="class-summary-icon summary-green"><Icon name="users" size={19} /></span><strong>{students.length}</strong><span>Enrolled students</span></div><div><span className="class-summary-icon summary-orange"><Icon name="calendar" size={19} /></span><strong>2024–25</strong><span>Academic year</span></div></section><div className="class-section-heading"><div><h2>Your classes</h2><p>Manage class rosters and teaching assignments.</p></div><button className="button button-primary button-small" onClick={onAdd}><Icon name="plus" size={16} /> Add class</button></div><section className="class-grid">{classes.map((schoolClass) => { const enrolled = students.filter((student) => student.grade === schoolClass.name).length; return <article className="class-card" key={schoolClass.id}><div className={`class-card-top ${colors[schoolClass.color]}`}><span className="class-book-icon"><Icon name="book" size={20} /></span><button className="row-more" aria-label={`More options for ${schoolClass.name}`}><Icon name="more" size={18} /></button><div className="class-grade">{schoolClass.name}</div><span className="class-id">{schoolClass.id} <i /> 2024–25</span></div><div className="class-card-body"><div className="class-detail-line"><span>Class teacher</span><span className="teacher-name"><Avatar name={schoolClass.teacher} className="teacher-avatar" />{schoolClass.teacher}</span></div><div className="class-detail-line"><span>Room</span><strong>{schoolClass.room}</strong></div><div className="class-detail-line"><span>Students</span><strong>{enrolled} <span className="muted-text">/ {schoolClass.capacity}</span></strong></div><div className="class-progress"><i style={{ width: `${Math.min((enrolled / schoolClass.capacity) * 100, 100)}%` }} /></div><button className="class-roster-link" onClick={() => setExpanded(expanded === schoolClass.id ? null : schoolClass.id)}>{expanded === schoolClass.id ? "Hide roster" : "View class roster"}<Icon name="chevron" size={15} /></button>{expanded === schoolClass.id && <div className="roster-list">{students.filter((student) => student.grade === schoolClass.name).map((student) => <div key={student.id}><Avatar name={student.name} className="roster-avatar" /><span>{student.name}</span><small>{student.id}</small></div>)}{enrolled === 0 && <p>No students are enrolled in this class yet.</p>}</div>}</div></article>; })}<button className="add-class-card" onClick={onAdd}><span><Icon name="plus" size={20} /></span><strong>Add a new class</strong><small>Create a grade and assign a teacher</small></button></section></>;
}
