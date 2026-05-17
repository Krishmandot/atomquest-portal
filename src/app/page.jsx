"use client";
import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0D0F14",
  surface: "#13161D",
  card: "#1A1E28",
  border: "#252A38",
  accent: "#E8FF47",
  accentDim: "#c8df30",
  accentGlow: "rgba(232,255,71,0.12)",
  text: "#F0F2F8",
  muted: "#6B7280",
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  blue: "#60A5FA",
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }

  .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 ${COLORS.accentGlow}; }
    50%       { box-shadow: 0 0 20px 4px ${COLORS.accentGlow}; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fadeUp { animation: fadeUp .35s ease both; }

  .btn-primary {
    background: ${COLORS.accent};
    color: #0D0F14;
    border: none;
    padding: 10px 22px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: background .15s, transform .1s;
    letter-spacing: .3px;
  }
  .btn-primary:hover { background: ${COLORS.accentDim}; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none; }

  .btn-ghost {
    background: transparent;
    color: ${COLORS.muted};
    border: 1px solid ${COLORS.border};
    padding: 9px 20px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: border-color .15s, color .15s;
  }
  .btn-ghost:hover { border-color: ${COLORS.accent}; color: ${COLORS.accent}; }

  .btn-danger {
    background: transparent;
    color: ${COLORS.danger};
    border: 1px solid ${COLORS.danger};
    padding: 9px 20px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background .15s;
  }
  .btn-danger:hover { background: rgba(248,113,113,.1); }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase;
  }
  .tag-pending  { background: rgba(251,191,36,.12); color: ${COLORS.warning}; }
  .tag-approved { background: rgba(52,211,153,.12); color: ${COLORS.success}; }
  .tag-draft    { background: rgba(107,114,128,.15); color: ${COLORS.muted}; }
  .tag-rework   { background: rgba(248,113,113,.12); color: ${COLORS.danger}; }
  .tag-locked   { background: rgba(96,165,250,.12);  color: ${COLORS.blue}; }

  input, select, textarea {
    background: ${COLORS.bg};
    border: 1px solid ${COLORS.border};
    color: ${COLORS.text};
    padding: 10px 14px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color .15s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: ${COLORS.accent};
  }
  input::placeholder, textarea::placeholder { color: ${COLORS.muted}; }
  select option { background: ${COLORS.card}; }

  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .6px;
    text-transform: uppercase;
    color: ${COLORS.muted};
    margin-bottom: 6px;
  }

  .card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 14px;
    padding: 24px;
  }

  .progress-bar-track {
    background: ${COLORS.border};
    border-radius: 4px;
    height: 6px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: ${COLORS.accent};
    transition: width .5s ease;
  }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: ${COLORS.muted}; border-bottom: 1px solid ${COLORS.border}; }
  td { padding: 13px 14px; border-bottom: 1px solid rgba(37,42,56,.6); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(232,255,71,.025); }
/* ... your other css ... */
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(232,255,71,.025); }

 .mobile-sidebar {
    width: 230px;
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid ${COLORS.border};
  }

  @media (max-width: 768px) {
    .mobile-sidebar {
      position: relative !important;
      width: 100% !important;
      min-height: auto !important;
      border-right: none !important;
      border-bottom: 1px solid ${COLORS.border} !important;
    }
    .main-content {
      padding: 24px !important;
    }
    .stats-grid {
      flex-direction: column !important;
    }
    .table-wrap {
      overflow-x: auto;
    }
  }
`;

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const THRUST_AREAS = ["Revenue Growth", "Cost Optimisation", "Customer Experience", "Product Quality", "People & Culture", "Operational Excellence", "Safety & Compliance", "Innovation"];
const UOM_TYPES = ["Min (Numeric/%)", "Max (Numeric/%)", "Timeline", "Zero"];
const STATUS_OPTIONS = ["Not Started", "On Track", "Completed"];

const USERS = {
  emp1:  { id: "emp1",  name: "Priya Sharma",    role: "employee", managerId: "mgr1", dept: "Sales",   email: "priya@atomberg.com" },
  emp2:  { id: "emp2",  name: "Rahul Mehta",     role: "employee", managerId: "mgr1", dept: "Sales",   email: "rahul@atomberg.com" },
  emp3:  { id: "emp3",  name: "Sneha Patel",     role: "employee", managerId: "mgr2", dept: "Ops",     email: "sneha@atomberg.com" },
  mgr1:  { id: "mgr1",  name: "Arun Iyer",       role: "manager",  managerId: null,   dept: "Sales",   email: "arun@atomberg.com" },
  mgr2:  { id: "mgr2",  name: "Divya Nair",      role: "manager",  managerId: null,   dept: "Ops",     email: "divya@atomberg.com" },
  admin: { id: "admin", name: "HR Admin",         role: "admin",    managerId: null,   dept: "HR",      email: "hr@atomberg.com" },
};

const SEED_GOALS = [
  {
    id: "g1", employeeId: "emp1", thrustArea: "Revenue Growth", title: "Achieve ₹1.2Cr quarterly sales target",
    description: "Drive direct sales across North zone channels", uom: "Min (Numeric/%)", target: 12000000,
    achievement: 9800000, weightage: 40, status: "On Track", goalStatus: "approved", isShared: false,
    checkIns: [{ quarter: "Q1", comment: "Strong pipeline, 82% achieved", by: "mgr1", date: "Jul 15" }],
    auditLog: []
  },
  {
    id: "g2", employeeId: "emp1", thrustArea: "Customer Experience", title: "Maintain NPS above 72",
    description: "Track and improve customer satisfaction scores", uom: "Min (Numeric/%)", target: 72,
    achievement: 74, weightage: 30, status: "Completed", goalStatus: "approved", isShared: false,
    checkIns: [], auditLog: []
  },
  {
    id: "g3", employeeId: "emp1", thrustArea: "Safety & Compliance", title: "Zero safety incidents",
    description: "Ensure zero reportable safety incidents in zone", uom: "Zero", target: 0,
    achievement: 0, weightage: 30, status: "On Track", goalStatus: "approved", isShared: true,
    checkIns: [], auditLog: []
  },
  {
    id: "g4", employeeId: "emp2", thrustArea: "Revenue Growth", title: "Close 15 enterprise accounts",
    description: "New logo acquisition in South zone", uom: "Min (Numeric/%)", target: 15,
    achievement: 11, weightage: 50, status: "On Track", goalStatus: "pending", isShared: false,
    checkIns: [], auditLog: []
  },
  {
    id: "g5", employeeId: "emp2", thrustArea: "People & Culture", title: "Complete 3 L&D certifications",
    description: "Upskilling plan for FY26", uom: "Min (Numeric/%)", target: 3,
    achievement: 1, weightage: 20, status: "Not Started", goalStatus: "pending", isShared: false,
    checkIns: [], auditLog: []
  },
  {
    id: "g6", employeeId: "emp2", thrustArea: "Safety & Compliance", title: "Zero safety incidents",
    description: "Ensure zero reportable safety incidents in zone", uom: "Zero", target: 0,
    achievement: 0, weightage: 30, status: "On Track", goalStatus: "pending", isShared: true,
    checkIns: [], auditLog: []
  },
  {
    id: "g7", employeeId: "emp3", thrustArea: "Cost Optimisation", title: "Reduce logistics cost by 8%",
    description: "Optimise last-mile delivery and warehousing costs", uom: "Max (Numeric/%)", target: 8,
    achievement: 5.2, weightage: 40, status: "On Track", goalStatus: "draft", isShared: false,
    checkIns: [], auditLog: []
  },
  {
    id: "g8", employeeId: "emp3", thrustArea: "Operational Excellence", title: "Reduce TAT to 2.5 days",
    description: "Improve order fulfilment turnaround time", uom: "Max (Numeric/%)", target: 2.5,
    achievement: 3.1, weightage: 40, status: "Not Started", goalStatus: "draft", isShared: false,
    checkIns: [], auditLog: []
  },
  {
    id: "g9", employeeId: "emp3", thrustArea: "Safety & Compliance", title: "Zero safety incidents",
    description: "Ensure zero reportable safety incidents in zone", uom: "Zero", target: 0,
    achievement: 0, weightage: 20, status: "Not Started", goalStatus: "draft", isShared: true,
    checkIns: [], auditLog: []
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function computeScore(goal) {
  const { uom, target, achievement } = goal;
  if (!achievement && achievement !== 0) return null;
  if (uom === "Zero") return achievement === 0 ? 100 : 0;
  if (uom === "Timeline") return achievement <= target ? 100 : Math.max(0, 100 - (achievement - target) * 10);
  if (uom === "Min (Numeric/%)") return target === 0 ? 100 : Math.min(150, Math.round((achievement / target) * 100));
  if (uom === "Max (Numeric/%)") return achievement === 0 ? 100 : Math.min(150, Math.round((target / achievement) * 100));
  return null;
}

function totalWeightage(goals) { return goals.reduce((s, g) => s + (Number(g.weightage) || 0), 0); }

function statusColor(s) {
  if (s === "approved") return COLORS.success;
  if (s === "pending")  return COLORS.warning;
  if (s === "rework")   return COLORS.danger;
  if (s === "draft")    return COLORS.muted;
  return COLORS.blue;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Sidebar({ user, view, setView, onLogout }) {
  const isEmp   = user.role === "employee";
  const isMgr   = user.role === "manager";
  const isAdmin = user.role === "admin";

  const navItems = [
    ...(isEmp   ? [
      { key: "my-goals",    icon: "◈", label: "My Goals" },
      { key: "checkin",     icon: "✦", label: "Check-In" },
    ] : []),
    ...(isMgr   ? [
      { key: "team",        icon: "◈", label: "Team Dashboard" },
      { key: "approvals",   icon: "⊞", label: "Approvals" },
      { key: "mgr-checkin", icon: "✦", label: "Check-Ins" },
    ] : []),
    ...(isAdmin  ? [
  { key: "admin-dash",  icon: "◈", label: "Overview" },
  { key: "all-goals",   icon: "⊞", label: "All Goals" },
  { key: "push-goal",   icon: "↑", label: "Push Shared Goal" },
  { key: "cycle",       icon: "⊙", label: "Cycle Config" },
  { key: "org",         icon: "⊕", label: "Org Hierarchy" },
  { key: "audit",       icon: "⊡", label: "Audit Log" },
  { key: "export",      icon: "↓", label: "Export Report" },
] : []),
...(isMgr ? [
  { key: "push-goal",   icon: "↑", label: "Push Shared Goal" },
] : []),
  ];

  const ROLE_COLORS = { employee: COLORS.blue, manager: COLORS.success, admin: COLORS.accent };
  const roleCol = ROLE_COLORS[user.role];

  return (
  <div className="mobile-sidebar" style={{ background: COLORS.surface, display: "flex", flexDirection: "column", zIndex: 10 }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: COLORS.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#0D0F14" }}>A</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -.3 }}>AtomQuest</div>
            <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Goals Portal</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ margin: "0 14px 20px", padding: "12px 14px", background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{user.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: roleCol, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: roleCol, fontWeight: 600, textTransform: "capitalize" }}>{user.role}</span>
          <span style={{ fontSize: 11, color: COLORS.muted }}>· {user.dept}</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px" }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setView(item.key)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
            border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 2, textAlign: "left",
            background: view === item.key ? COLORS.accentGlow : "transparent",
            color: view === item.key ? COLORS.accent : COLORS.muted,
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14,
            transition: "all .15s"
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
            {view === item.key && <span style={{ marginLeft: "auto", width: 3, height: 3, borderRadius: "50%", background: COLORS.accent }} />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 14px", borderTop: `1px solid ${COLORS.border}` }}>
        <button onClick={onLogout} className="btn-ghost" style={{ width: "100%", fontSize: 13 }}>Sign Out</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card fadeUp" style={{ flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .6, textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent || COLORS.text, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function GoalRow({ goal, onEdit, onCheckin, onApprove, onReturn, onUnlock, isManager, isAdmin, isReadonly }) {
  const score = computeScore(goal);
  const scorePct = score !== null ? Math.min(100, score) : null;

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{goal.title}</div>
        <div style={{ fontSize: 11, color: COLORS.muted }}>{goal.thrustArea}</div>
      </td>
      <td><span className="mono" style={{ fontSize: 12, color: COLORS.muted }}>{goal.uom.split(" ")[0]}</span></td>
      <td style={{ fontWeight: 600 }}>{goal.target}</td>
      <td style={{ fontWeight: 600, color: COLORS.accent }}>{goal.achievement ?? "—"}</td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}>
          <div className="progress-bar-track" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${scorePct ?? 0}%`, background: scorePct >= 100 ? COLORS.success : COLORS.accent }} />
          </div>
          <span className="mono" style={{ fontSize: 11, color: COLORS.muted, minWidth: 32 }}>{score !== null ? `${score}%` : "—"}</span>
        </div>
      </td>
      <td><span style={{ fontSize: 12, color: goal.status === "Completed" ? COLORS.success : goal.status === "Not Started" ? COLORS.muted : COLORS.warning }}>{goal.status}</span></td>
      <td><span style={{ fontSize: 11, fontWeight: 700, color: statusColor(goal.goalStatus), textTransform: "uppercase", letterSpacing: .4 }}>{goal.goalStatus}</span></td>
      <td style={{ textAlign: "right" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          {!isReadonly && onEdit && goal.goalStatus !== "approved" && (
            <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => onEdit(goal)}>Edit</button>
          )}
          {isManager && goal.goalStatus === "pending" && onApprove && (
            <>
              <button className="btn-primary" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => onApprove(goal.id)}>Approve</button>
              <button className="btn-danger" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => onReturn(goal.id)}>Return</button>
            </>
          )}
          {isAdmin && goal.goalStatus === "approved" && onUnlock && (
            <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: 12, color: COLORS.blue, borderColor: COLORS.blue }} onClick={() => onUnlock(goal.id)}>Unlock</button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [selected, setSelected] = useState(null);

  const options = [
    { userId: "emp1", label: "Priya Sharma", sub: "Employee · Sales" },
    { userId: "emp2", label: "Rahul Mehta",  sub: "Employee · Sales" },
    { userId: "emp3", label: "Sneha Patel",  sub: "Employee · Ops" },
    { userId: "mgr1", label: "Arun Iyer",    sub: "Manager · Sales" },
    { userId: "mgr2", label: "Divya Nair",   sub: "Manager · Ops" },
    { userId: "admin", label: "HR Admin",    sub: "Admin · HR" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: COLORS.bg }}>
      <style>{STYLE}</style>
      <div className="fadeUp" style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: COLORS.accent, borderRadius: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#0D0F14" }}>A</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -.5, marginBottom: 6 }}>AtomQuest Portal</h1>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Select a user to continue — demo environment</p>
        </div>

        {/* Role selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {options.map(o => (
            <button key={o.userId} onClick={() => setSelected(o.userId)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", border: `1px solid ${selected === o.userId ? COLORS.accent : COLORS.border}`,
              borderRadius: 10, background: selected === o.userId ? COLORS.accentGlow : COLORS.card,
              cursor: "pointer", color: COLORS.text, fontFamily: "'Syne', sans-serif", transition: "all .15s"
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{o.label}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{o.sub}</div>
              </div>
              {selected === o.userId && <span style={{ fontSize: 18, color: COLORS.accent }}>✓</span>}
            </button>
          ))}
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}
          disabled={!selected} onClick={() => selected && onLogin(USERS[selected])}>
          Enter Portal →
        </button>

        <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 12, marginTop: 20 }}>
          FY 2025-26 · Q1 Check-In Window Active
        </p>
      </div>
    </div>
  );
}

// ─── MY GOALS VIEW ────────────────────────────────────────────────────────────
function MyGoalsView({ user, goals, setGoals, allUsers }) {
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const myGoals = goals.filter(g => g.employeeId === user.id);
  const tw = totalWeightage(myGoals);
  const approved = myGoals.filter(g => g.goalStatus === "approved").length;

  const blank = { thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "", isShared: false };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  function openAdd() { setForm(blank); setEditGoal(null); setErrors({}); setShowForm(true); }
  function openEdit(g) { setForm({ ...g }); setEditGoal(g.id); setErrors({}); setShowForm(true); }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.target) errs.target = "Required";
    const w = Number(form.weightage);
    if (!w) errs.weightage = "Required";
    else if (w < 10) errs.weightage = "Min 10%";
    else {
      const otherW = myGoals.filter(g => g.id !== editGoal).reduce((s, g) => s + Number(g.weightage), 0);
      if (otherW + w > 100) errs.weightage = `Exceeds 100% (currently ${otherW}% used)`;
    }
    if (!editGoal && myGoals.length >= 8) errs.title = "Max 8 goals reached";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editGoal) {
      setGoals(prev => prev.map(g => g.id === editGoal ? { ...g, ...form, target: Number(form.target), weightage: Number(form.weightage) } : g));
    } else {
      const newG = { ...form, id: `g_${Date.now()}`, employeeId: user.id, achievement: null, status: "Not Started", goalStatus: "draft", checkIns: [], auditLog: [], target: Number(form.target), weightage: Number(form.weightage) };
      setGoals(prev => [...prev, newG]);
    }
    setShowForm(false);
  }

  function handleSubmit(goalId) {
    if (tw !== 100) return alert("Total weightage must equal exactly 100% before submitting.");
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, goalStatus: "pending" } : g));
  }

  function handleSubmitAll() {
    const draftGoals = myGoals.filter(g => g.goalStatus === "draft");
    if (tw !== 100) { alert(`Total weightage is ${tw}%. Must be exactly 100%.`); return; }
    setGoals(prev => prev.map(g => g.employeeId === user.id && g.goalStatus === "draft" ? { ...g, goalStatus: "pending" } : g));
  }

  const weightUsed = tw;
  const weightLeft = 100 - weightUsed;

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>My Goals</h2>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>FY 2025-26 · {myGoals.length}/8 goals · {approved} approved</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {myGoals.some(g => g.goalStatus === "draft") && (
            <button className="btn-ghost" onClick={handleSubmitAll} style={{ fontSize: 13 }}>Submit All Drafts</button>
          )}
          {myGoals.length < 8 && (
            <button className="btn-primary" onClick={openAdd}>+ Add Goal</button>
          )}
        </div>
      </div>

      {/* Weightage bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Weightage Allocation</span>
          <span className="mono" style={{ fontSize: 13, color: weightUsed === 100 ? COLORS.success : weightUsed > 100 ? COLORS.danger : COLORS.warning }}>
            {weightUsed}% / 100%
          </span>
        </div>
        <div className="progress-bar-track" style={{ height: 10 }}>
          <div className="progress-bar-fill" style={{ width: `${Math.min(100, weightUsed)}%`, background: weightUsed > 100 ? COLORS.danger : weightUsed === 100 ? COLORS.success : COLORS.accent }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted }}>
          {weightUsed === 100 ? "✓ Ready to submit" : weightUsed > 100 ? `⚠ Over by ${weightUsed - 100}%` : `${weightLeft}% remaining`}
        </div>
      </div>

      {/* Goals table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Goal</th><th>UoM</th><th>Target</th><th>Actual</th><th style={{ minWidth: 140 }}>Progress</th><th>Status</th><th>Weight</th><th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myGoals.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", color: COLORS.muted, padding: 32 }}>No goals yet. Add your first goal above.</td></tr>
              )}
              {myGoals.map(g => (
                <tr key={g.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted, display: "flex", gap: 6, alignItems: "center" }}>
                      {g.thrustArea} {g.isShared && <span style={{ color: COLORS.blue, fontWeight: 700 }}>· SHARED</span>}
                    </div>
                  </td>
                  <td><span className="mono" style={{ fontSize: 12, color: COLORS.muted }}>{g.uom.split(" ")[0]}</span></td>
                  <td style={{ fontWeight: 600 }}>{g.target}</td>
                  <td style={{ color: COLORS.accent, fontWeight: 600 }}>{g.achievement ?? "—"}</td>
                  <td>
                    {(() => { const s = computeScore(g); const sp = s !== null ? Math.min(100, s) : 0; return (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar-track" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${sp}%`, background: sp >= 100 ? COLORS.success : COLORS.accent }} />
                        </div>
                        <span className="mono" style={{ fontSize: 11, color: COLORS.muted, minWidth: 32 }}>{s !== null ? `${s}%` : "—"}</span>
                      </div>
                    ); })()}
                  </td>
                  <td><span style={{ fontSize: 12, color: g.status === "Completed" ? COLORS.success : g.status === "Not Started" ? COLORS.muted : COLORS.warning }}>{g.status}</span></td>
                  <td><span className="mono" style={{ fontWeight: 700 }}>{g.weightage}%</span></td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(g.goalStatus), textTransform: "uppercase", letterSpacing: .4, alignSelf: "center" }}>{g.goalStatus}</span>
                      {g.goalStatus === "draft" && !g.isShared && (
                        <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit(g)}>Edit</button>
                      )}
                      {g.goalStatus === "draft" && (
                        <button className="btn-primary" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => handleSubmit(g.id)}>Submit</button>
                      )}
                      {g.goalStatus === "rework" && (
                        <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit(g)}>Rework</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="card fadeUp" style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{editGoal ? "Edit Goal" : "Add New Goal"}</h3>
              <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label>Thrust Area</label>
                <select value={form.thrustArea} onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))}>
                  {THRUST_AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label>Goal Title {errors.title && <span style={{ color: COLORS.danger }}>— {errors.title}</span>}</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Achieve ₹1.2Cr quarterly revenue" />
              </div>
              <div>
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief context about this goal..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Unit of Measurement</label>
                  <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))}>
                    {UOM_TYPES.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label>Target {errors.target && <span style={{ color: COLORS.danger }}>— {errors.target}</span>}</label>
                  <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="e.g. 12000000" />
                </div>
              </div>
              <div>
                <label>Weightage (%) {errors.weightage && <span style={{ color: COLORS.danger }}>— {errors.weightage}</span>}</label>
                <input type="number" min={10} max={100} value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} placeholder="Min 10%, and total must equal 100%" />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{editGoal ? "Save Changes" : "Add Goal"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHECK-IN VIEW (Employee) ─────────────────────────────────────────────────
function CheckinView({ user, goals, setGoals }) {
  const myGoals = goals.filter(g => g.employeeId === user.id && g.goalStatus === "approved");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  // Active quarter based on current month
  const month = new Date().getMonth() + 1; // 1-12
  const activeQuarter = month >= 5 && month <= 6 ? "Goal Setting" :
                        month === 7 || month === 8 || month === 9 ? "Q1" :
                        month === 10 || month === 11 || month === 12 ? "Q2" :
                        month === 1 || month === 2 || month === 3 ? "Q3" : "Q4";

  const [selectedQ, setSelectedQ] = useState(activeQuarter === "Goal Setting" ? "Q1" : activeQuarter);

  const quarters = [
    { key: "Q1", label: "Q1 Check-In", window: "July – September", month: "Jul" },
    { key: "Q2", label: "Q2 Check-In", window: "October – December", month: "Oct" },
    { key: "Q3", label: "Q3 Check-In", window: "January – March", month: "Jan" },
    { key: "Q4", label: "Q4 / Annual", window: "March – April", month: "Mar", isFinal: true },
  ];

  function isWindowOpen(qKey) {
    if (qKey === "Q1") return month >= 7 && month <= 9;
    if (qKey === "Q2") return month >= 10 && month <= 12;
    if (qKey === "Q3") return month >= 1 && month <= 3;
    if (qKey === "Q4") return month >= 3 && month <= 4;
    return false;
  }

  function openEdit(g) { setEditing(g.id); setForm({ achievement: g.achievement ?? "", status: g.status }); }

  function handleSave(goalId) {
    const goalToUpdate = goals.find(g => g.id === goalId);
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) return { ...g, achievement: Number(form.achievement), status: form.status };
      if (g.isShared && goalToUpdate.isShared && g.title === goalToUpdate.title)
        return { ...g, achievement: Number(form.achievement) };
      return g;
    }));
    setEditing(null);
  }

  const windowOpen = isWindowOpen(selectedQ);
  const selectedQuarterInfo = quarters.find(q => q.key === selectedQ);

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Quarterly Check-In</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>Log your actual achievements per quarter against planned targets.</p>

      {/* Active window banner */}
      <div style={{ background: activeQuarter === "Goal Setting" ? "rgba(232,255,71,0.08)" : "rgba(52,211,153,0.08)", border: `1px solid ${activeQuarter === "Goal Setting" ? COLORS.accent : COLORS.success}`, borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: activeQuarter === "Goal Setting" ? COLORS.accent : COLORS.success }}>
        Currently active: <strong>{activeQuarter === "Goal Setting" ? "Goal Setting Window (May – June)" : `${activeQuarter} Check-In Window`}</strong> — {activeQuarter === "Goal Setting" ? "Create and submit your goals" : `Log your ${activeQuarter} achievements`}
      </div>

      {/* Quarter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {quarters.map(q => (
          <button key={q.key} onClick={() => setSelectedQ(q.key)} style={{
            padding: "8px 18px", borderRadius: 8, border: `1px solid ${selectedQ === q.key ? COLORS.accent : COLORS.border}`,
            background: selectedQ === q.key ? COLORS.accentGlow : "transparent",
            color: selectedQ === q.key ? COLORS.accent : COLORS.muted,
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer",
            position: "relative"
          }}>
            {q.label}
            {activeQuarter === q.key && <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: COLORS.success }} />}
            {q.isFinal && <span style={{ marginLeft: 6, fontSize: 10, color: COLORS.warning, fontWeight: 700 }}>FINAL</span>}
          </button>
        ))}
      </div>

      {/* Window status */}
      <div style={{ marginBottom: 20, fontSize: 12, color: COLORS.muted }}>
        <span style={{ fontWeight: 700, color: windowOpen ? COLORS.success : COLORS.danger }}>
          {windowOpen ? "● Window Open" : "● Window Closed"}
        </span>
        {" "}— {selectedQuarterInfo?.window}
        {!windowOpen && <span style={{ marginLeft: 8, color: COLORS.muted }}>(Opens in {selectedQuarterInfo?.month})</span>}
      </div>

      {myGoals.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: COLORS.muted, padding: 48 }}>
          No approved goals to update yet. Get your goals approved first.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {myGoals.map(g => {
          const score = computeScore(g);
          const isEditing = editing === g.id;
          return (
            <div key={g.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{g.thrustArea} · <span className="mono">{g.uom}</span> · {g.weightage}% weight</div>
                </div>
                {!isEditing && windowOpen && (
                  <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => openEdit(g)}>
                    Update {selectedQ}
                  </button>
                )}
                {!windowOpen && (
                  <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600 }}>Window Closed</span>
                )}
              </div>

              {isEditing ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label>Actual Achievement ({selectedQ})</label>
                      <input type="number" value={form.achievement} onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))} />
                    </div>
                    <div>
                      <label>Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setEditing(null)}>Cancel</button>
                    <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => handleSave(g.id)}>Save {selectedQ}</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { label: "Target", val: g.target },
                    { label: "Actual", val: g.achievement ?? "—", accent: true },
                    { label: "Score", val: score !== null ? `${score}%` : "—", accent: true },
                    { label: "Status", val: g.status },
                  ].map(item => (
                    <div key={item.label} style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", color: COLORS.muted, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontWeight: 700, color: item.accent ? COLORS.accent : COLORS.text }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Q4 Annual summary */}
              {selectedQ === "Q4" && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(251,191,36,0.08)", borderRadius: 8, borderLeft: `3px solid ${COLORS.warning}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.warning, marginBottom: 4 }}>ANNUAL SUMMARY</div>
                  <div style={{ fontSize: 13 }}>Final achievement score: <strong style={{ color: COLORS.accent }}>{score !== null ? `${score}%` : "—"}</strong></div>
                </div>
              )}

              {g.checkIns.length > 0 && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: COLORS.bg, borderRadius: 8, borderLeft: `3px solid ${COLORS.accent}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, marginBottom: 4 }}>MANAGER FEEDBACK</div>
                  {g.checkIns.map((c, i) => (
                    <div key={i} style={{ fontSize: 13, color: COLORS.text }}>"{c.comment}" <span style={{ color: COLORS.muted }}>— {USERS[c.by]?.name}, {c.date}</span></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MANAGER TEAM VIEW ────────────────────────────────────────────────────────
function TeamView({ user, goals, allUsers }) {
  const teamEmps = Object.values(allUsers).filter(u => u.role === "employee" && u.managerId === user.id);

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Team Dashboard</h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="Team Members" value={teamEmps.length} />
        <StatCard label="Goals Pending Approval" value={goals.filter(g => teamEmps.find(e => e.id === g.employeeId) && g.goalStatus === "pending").length} accent={COLORS.warning} />
        <StatCard label="Goals Approved" value={goals.filter(g => teamEmps.find(e => e.id === g.employeeId) && g.goalStatus === "approved").length} accent={COLORS.success} />
        <StatCard label="Avg Score" value={(() => {
          const scores = goals.filter(g => teamEmps.find(e => e.id === g.employeeId) && g.goalStatus === "approved").map(computeScore).filter(Boolean);
          return scores.length ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%` : "—";
        })()} accent={COLORS.accent} />
      </div>

      {teamEmps.map(emp => {
        const empGoals = goals.filter(g => g.employeeId === emp.id);
        const approved = empGoals.filter(g => g.goalStatus === "approved");
        const tw = totalWeightage(approved);
        const avgScore = (() => {
          const scores = approved.map(computeScore).filter(s => s !== null);
          return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        })();
        return (
          <div key={emp.id} className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{emp.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{emp.dept} · {empGoals.length} goals · {totalWeightage(empGoals)}% allocated</div>
              </div>
              {avgScore !== null && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: avgScore >= 100 ? COLORS.success : COLORS.accent }}>{avgScore}%</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>avg score</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {empGoals.map(g => (
                <div key={g.id} style={{ background: COLORS.bg, borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2, maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.title}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(g.goalStatus), textTransform: "uppercase" }}>{g.goalStatus}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MANAGER APPROVALS VIEW ───────────────────────────────────────────────────
function ApprovalsView({ user, goals, setGoals, allUsers }) {
  const teamEmpIds = Object.values(allUsers).filter(u => u.role === "employee" && u.managerId === user.id).map(u => u.id);
  const pendingGoals = goals.filter(g => teamEmpIds.includes(g.employeeId) && g.goalStatus === "pending");
  const [editingGoal, setEditingGoal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [commentGoal, setCommentGoal] = useState(null);
  const [comment, setComment] = useState("");

  function approve(gid) {
    setGoals(prev => prev.map(g => g.id === gid ? { 
      ...g, 
      goalStatus: "approved",
      auditLog: [...(g.auditLog || []), { 
        action: "approved", 
        by: user.id, 
        reason: "Manager Approval",
        date: new Date().toLocaleDateString() 
      }]
    } : g));
  }
  function returnGoal(gid) {
    setGoals(prev => prev.map(g => g.id === gid ? { ...g, goalStatus: "rework" } : g));
  }
  function saveInlineEdit() {
  setGoals(prev => prev.map(g => g.id === editingGoal.id ? { 
    ...g, 
    ...editForm, 
    target: Number(editForm.target), 
    weightage: Number(editForm.weightage),
    auditLog: [...(g.auditLog || []), { 
      action: "manager inline edit", 
      by: user.id, 
      reason: `Target/Weight changed`,
      date: new Date().toLocaleDateString() 
    }]
  } : g));
  setEditingGoal(null);
}

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Goal Approvals</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28 }}>{pendingGoals.length} goals pending your review</p>

      {pendingGoals.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: COLORS.muted, padding: 48 }}>All caught up — no pending approvals.</div>
      )}

      {pendingGoals.map(g => {
        const emp = allUsers[g.employeeId];
        const empAllGoals = goals.filter(x => x.employeeId === g.employeeId);
        const tw = totalWeightage(empAllGoals.filter(x => x.goalStatus !== "rework"));
        return (
          <div key={g.id} className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 3 }}>{emp?.name} · {emp?.dept}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>{g.thrustArea} · <span className="mono">{g.uom}</span></div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { setEditingGoal(g); setEditForm({ target: g.target, weightage: g.weightage }); }}>Edit</button>
                <button className="btn-primary" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => approve(g.id)}>Approve</button>
                <button className="btn-danger" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => returnGoal(g.id)}>Return</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
              {[
                { label: "Target", val: g.target },
                { label: "Weightage", val: `${g.weightage}%` },
                { label: "Emp. Total Wt", val: `${tw}%`, accent: tw === 100 ? COLORS.success : COLORS.warning },
              ].map(item => (
                <div key={item.label} style={{ background: COLORS.bg, padding: "8px 12px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontWeight: 700, color: item.accent || COLORS.text }}>{item.val}</div>
                </div>
              ))}
            </div>

            {g.description && <p style={{ fontSize: 13, color: COLORS.muted }}>{g.description}</p>}

            {editingGoal?.id === g.id && (
              <div style={{ marginTop: 16, padding: 16, background: COLORS.bg, borderRadius: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginBottom: 12 }}>INLINE EDIT</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label>Target</label>
                    <input type="number" value={editForm.target} onChange={e => setEditForm(f => ({ ...f, target: e.target.value }))} />
                  </div>
                  <div>
                    <label>Weightage (%)</label>
                    <input type="number" value={editForm.weightage} onChange={e => setEditForm(f => ({ ...f, weightage: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditingGoal(null)}>Cancel</button>
                  <button className="btn-primary" style={{ fontSize: 12 }} onClick={saveInlineEdit}>Save & Approve</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MANAGER CHECK-IN VIEW ────────────────────────────────────────────────────
function MgrCheckinView({ user, goals, setGoals, allUsers }) {
  const teamEmpIds = Object.values(allUsers).filter(u => u.role === "employee" && u.managerId === user.id).map(u => u.id);
  const teamGoals = goals.filter(g => teamEmpIds.includes(g.employeeId) && g.goalStatus === "approved");
  const [commentGoal, setCommentGoal] = useState(null);
  const [comment, setComment] = useState("");

  function addComment(gid) {
    if (!comment.trim()) return;
    setGoals(prev => prev.map(g => g.id === gid ? {
      ...g, checkIns: [...g.checkIns, { quarter: "Q1", comment: comment.trim(), by: user.id, date: "Jul 2025" }]
    } : g));
    setCommentGoal(null);
    setComment("");
  }

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Q1 Check-Ins</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28 }}>Review progress and add structured feedback for your team</p>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>Employee</th><th>Goal</th><th>Target</th><th>Actual</th><th>Score</th><th>Status</th><th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {teamGoals.map(g => {
              const emp = allUsers[g.employeeId];
              const score = computeScore(g);
              return (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{emp?.name}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{g.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{g.thrustArea}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{g.target}</td>
                  <td style={{ color: COLORS.accent, fontWeight: 700 }}>{g.achievement ?? "—"}</td>
                  <td>
                    <span className="mono" style={{ color: score !== null ? (score >= 100 ? COLORS.success : COLORS.accent) : COLORS.muted }}>
                      {score !== null ? `${score}%` : "—"}
                    </span>
                  </td>
                  <td><span style={{ fontSize: 12, color: g.status === "Completed" ? COLORS.success : g.status === "Not Started" ? COLORS.muted : COLORS.warning }}>{g.status}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => { setCommentGoal(g.id); setComment(""); }}>
                      {g.checkIns.length ? "Add Note" : "+ Check-In"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {commentGoal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="card fadeUp" style={{ width: "100%", maxWidth: 480 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Add Check-In Comment</h3>
            <label>Your Comment</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Document your discussion, observations, or next steps..." />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn-ghost" onClick={() => setCommentGoal(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => addComment(commentGoal)}>Save Comment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─── CYCLE CONFIG VIEW ────────────────────────────────────────────────────────
function CycleConfigView({ goals }) {
  const month = new Date().getMonth() + 1;
  const activeWindow = month >= 5 && month <= 6 ? "Goal Setting" :
                       month >= 7 && month <= 9 ? "Q1 Check-In" :
                       month >= 10 && month <= 12 ? "Q2 Check-In" :
                       month >= 1 && month <= 3 ? "Q3 Check-In" : "Q4 Annual";

  const cycles = [
    { label: "Goal Setting Window", period: "1 May – 30 June", status: month >= 5 && month <= 6 },
    { label: "Q1 Check-In", period: "July – September", status: month >= 7 && month <= 9 },
    { label: "Q2 Check-In", period: "October – December", status: month >= 10 && month <= 12 },
    { label: "Q3 Check-In", period: "January – March", status: month >= 1 && month <= 3 },
    { label: "Q4 / Annual", period: "March – April", status: month >= 3 && month <= 4 },
  ];

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Cycle Configuration</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28 }}>FY 2025-26 performance cycle windows and status.</p>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <div className="card fadeUp" style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .6, textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>Financial Year</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>2025–26</div>
        </div>
        <div className="card fadeUp" style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .6, textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>Active Window</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.success }}>{activeWindow}</div>
        </div>
        <div className="card fadeUp" style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .6, textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>Total Goals</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{goals.length}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Quarter Windows — FY 2025-26</div>
        {cycles.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < cycles.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>{c.period}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.status ? COLORS.success : COLORS.border, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: c.status ? COLORS.success : COLORS.muted }}>
                {c.status ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ORG HIERARCHY VIEW ───────────────────────────────────────────────────────
function OrgHierarchyView({ allUsers }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", dept: "", role: "employee", managerId: "mgr1" });
  const [users, setUsers] = useState(Object.values(allUsers));
  const [done, setDone] = useState(false);

  const managers = users.filter(u => u.role === "manager");
  const employees = users.filter(u => u.role === "employee");

  function handleAdd() {
    if (!newUser.name || !newUser.email) return alert("Name and email required.");
    setUsers(prev => [...prev, { ...newUser, id: `u_${Date.now()}` }]);
    setDone(true);
    setTimeout(() => { setDone(false); setShowAdd(false); setNewUser({ name: "", email: "", dept: "", role: "employee", managerId: "mgr1" }); }, 1500);
  }

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Org Hierarchy</h2>
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Manage employees and reporting structure.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add Employee</button>
      </div>

      {/* Managers */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, letterSpacing: .6, textTransform: "uppercase", marginBottom: 12 }}>Managers</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {managers.map(m => (
            <div key={m.id} className="card" style={{ minWidth: 180, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>{m.dept} · {m.email}</div>
              <div style={{ fontSize: 11 }}>
                <span style={{ color: COLORS.success, fontWeight: 700 }}>
                  {employees.filter(e => e.managerId === m.id).length} direct reports
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employees table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700, fontSize: 15 }}>
          Employees ({employees.length})
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Dept</th><th>Reports To</th><th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 600 }}>{emp.name}</td>
                <td style={{ color: COLORS.muted, fontSize: 13 }}>{emp.email}</td>
                <td>{emp.dept}</td>
                <td>{managers.find(m => m.id === emp.managerId)?.name || "—"}</td>
                <td><span style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue, textTransform: "uppercase" }}>{emp.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add employee modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div className="card fadeUp" style={{ width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18 }}>{done ? "Added!" : "Add Employee"}</h3>
              <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setShowAdd(false)}>✕</button>
            </div>
            {done ? (
              <div style={{ textAlign: "center", padding: 20, color: COLORS.success, fontSize: 32 }}>✓</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label>Full Name</label><input value={newUser.name} onChange={e => setNewUser(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Amit Shah" /></div>
                <div><label>Email</label><input value={newUser.email} onChange={e => setNewUser(f => ({ ...f, email: e.target.value }))} placeholder="amit@atomberg.com" /></div>
                <div><label>Department</label><input value={newUser.dept} onChange={e => setNewUser(f => ({ ...f, dept: e.target.value }))} placeholder="e.g. Sales" /></div>
                <div>
                  <label>Reports To</label>
                  <select value={newUser.managerId} onChange={e => setNewUser(f => ({ ...f, managerId: e.target.value }))}>
                    {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleAdd}>Add Employee</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashView({ goals, allUsers }) {
  const employees = Object.values(allUsers).filter(u => u.role === "employee");
  const totalGoals = goals.length;
  const approved = goals.filter(g => g.goalStatus === "approved").length;
  const pending = goals.filter(g => g.goalStatus === "pending").length;
  const avgScore = (() => {
    const scores = goals.filter(g => g.goalStatus === "approved").map(computeScore).filter(s => s !== null);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  })();

  const byThrust = THRUST_AREAS.map(t => ({ name: t, count: goals.filter(g => g.thrustArea === t).length })).filter(x => x.count > 0);

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Organisation Overview</h2>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="Total Employees" value={employees.length} />
        <StatCard label="Total Goals" value={totalGoals} />
        <StatCard label="Approved" value={approved} accent={COLORS.success} />
        <StatCard label="Pending" value={pending} accent={COLORS.warning} />
        <StatCard label="Org Avg Score" value={avgScore !== null ? `${avgScore}%` : "—"} accent={COLORS.accent} />
      </div>

      {/* Per-employee summary */}
      <div className="card" style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Employee Completion Status</div>
        </div>
        <table>
          <thead><tr><th>Employee</th><th>Dept</th><th>Goals</th><th>Approved</th><th>Pending</th><th>Avg Score</th><th>Check-Ins Done</th></tr></thead>
          <tbody>
            {employees.map(emp => {
              const eg = goals.filter(g => g.employeeId === emp.id);
              const ea = eg.filter(g => g.goalStatus === "approved");
              const scores = ea.map(computeScore).filter(s => s !== null);
              const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
              const checkins = ea.filter(g => g.checkIns.length > 0).length;
              return (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ color: COLORS.muted }}>{emp.dept}</td>
                  <td>{eg.length}</td>
                  <td style={{ color: COLORS.success, fontWeight: 600 }}>{ea.length}</td>
                  <td style={{ color: COLORS.warning, fontWeight: 600 }}>{eg.filter(g => g.goalStatus === "pending").length}</td>
                  <td style={{ color: COLORS.accent, fontWeight: 700 }} className="mono">{avg !== null ? `${avg}%` : "—"}</td>
                  <td>{checkins}/{ea.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Goals by Thrust Area */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Goals by Thrust Area</div>
        {byThrust.map(t => (
          <div key={t.name} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
              <span>{t.name}</span>
              <span className="mono" style={{ color: COLORS.muted }}>{t.count}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${Math.round(t.count / totalGoals * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN ALL GOALS ──────────────────────────────────────────────────────────
function AllGoalsView({ goals, setGoals, allUsers }) {
  function unlockGoal(gid) {
    const reason = prompt("Reason for unlocking this goal:");
    if (!reason) return;
    setGoals(prev => prev.map(g => g.id === gid ? {
      ...g, goalStatus: "draft",
      auditLog: [...g.auditLog, { action: "unlocked", by: "admin", reason, date: new Date().toLocaleDateString() }]
    } : g));
  }

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>All Goals</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Goal</th><th>Thrust</th><th>Weight</th><th>Score</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {goals.map(g => {
                const emp = allUsers[g.employeeId];
                const score = computeScore(g);
                return (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 600 }}>{emp?.name}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{g.title}</div>
                      {g.isShared && <span style={{ fontSize: 10, color: COLORS.blue, fontWeight: 700 }}>SHARED</span>}
                    </td>
                    <td style={{ color: COLORS.muted, fontSize: 12 }}>{g.thrustArea}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>{g.weightage}%</td>
                    <td className="mono" style={{ color: score !== null ? COLORS.accent : COLORS.muted }}>{score !== null ? `${score}%` : "—"}</td>
                    <td><span style={{ fontSize: 11, fontWeight: 700, color: statusColor(g.goalStatus), textTransform: "uppercase" }}>{g.goalStatus}</span></td>
                    <td style={{ textAlign: "right" }}>
                      {g.goalStatus === "approved" && (
                        <button className="btn-ghost" style={{ fontSize: 12, padding: "5px 12px", color: COLORS.blue, borderColor: COLORS.blue }} onClick={() => unlockGoal(g.id)}>Unlock</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PUSH SHARED GOAL ─────────────────────────────────────────────────────────
function PushGoalView({ goals, setGoals, allUsers }) {
  const employees = Object.values(allUsers).filter(u => u.role === "employee");
  const [form, setForm] = useState({ thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "10" });
  const [selected, setSelected] = useState([]);
  const [done, setDone] = useState(false);

  function toggleEmp(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function push() {
    if (!form.title || !form.target || selected.length === 0) return alert("Fill all fields and select at least one employee.");
    const newGoals = selected.map(empId => ({
      ...form, id: `sg_${empId}_${Date.now()}`, employeeId: empId,
      target: Number(form.target), weightage: Number(form.weightage),
      achievement: null, status: "Not Started", goalStatus: "approved",
      isShared: true, checkIns: [], auditLog: [{ action: "pushed by admin", by: "admin", date: new Date().toLocaleDateString() }]
    }));
    setGoals(prev => [...prev, ...newGoals]);
    setDone(true);
  }

  if (done) return (
    <div className="fadeUp" style={{ textAlign: "center", padding: 60 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
      <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Shared Goal Pushed</h3>
      <p style={{ color: COLORS.muted }}>Goal pushed to {selected.length} employees. They can only adjust weightage.</p>
      <button className="btn-ghost" style={{ marginTop: 24 }} onClick={() => { setDone(false); setSelected([]); setForm({ thrustArea: THRUST_AREAS[0], title: "", description: "", uom: UOM_TYPES[0], target: "", weightage: "10" }); }}>Push Another</button>
    </div>
  );

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Push Shared Goal</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28 }}>Push a departmental KPI to multiple employees. Title and Target will be read-only for recipients.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Goal Details</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label>Thrust Area</label>
              <select value={form.thrustArea} onChange={e => setForm(f => ({ ...f, thrustArea: e.target.value }))}>
                {THRUST_AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label>Goal Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Zero safety incidents" />
            </div>
            <div>
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label>UoM</label>
                <select value={form.uom} onChange={e => setForm(f => ({ ...f, uom: e.target.value }))}>
                  {UOM_TYPES.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label>Target</label>
                <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
              </div>
            </div>
            <div>
              <label>Default Weightage (%) — employees can change this</label>
              <input type="number" min={10} value={form.weightage} onChange={e => setForm(f => ({ ...f, weightage: e.target.value }))} />
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Select Recipients</div>
            {employees.map(emp => (
              <div key={emp.id} onClick={() => toggleEmp(emp.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 8, cursor: "pointer", marginBottom: 6,
                background: selected.includes(emp.id) ? COLORS.accentGlow : COLORS.bg,
                border: `1px solid ${selected.includes(emp.id) ? COLORS.accent : COLORS.border}`
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected.includes(emp.id) ? COLORS.accent : COLORS.border}`, background: selected.includes(emp.id) ? COLORS.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected.includes(emp.id) && <span style={{ fontSize: 11, color: "#0D0F14", fontWeight: 900 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{emp.dept}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={push}>
            Push to {selected.length} employee{selected.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────
function AuditView({ goals, allUsers }) {
  const entries = goals.flatMap(g =>
    g.auditLog.map(a => ({ ...a, goalTitle: g.title, empId: g.employeeId }))
  );

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Audit Log</h2>
      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: COLORS.muted, padding: 48 }}>No audit entries yet. Changes to approved goals will appear here.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead><tr><th>Date</th><th>Action</th><th>Goal</th><th>Employee</th><th>By</th><th>Reason</th></tr></thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 12 }}>{e.date}</td>
                  <td style={{ fontWeight: 600, textTransform: "capitalize" }}>{e.action}</td>
                  <td style={{ fontSize: 13 }}>{e.goalTitle}</td>
                  <td>{allUsers[e.empId]?.name}</td>
                  <td style={{ color: COLORS.muted }}>{e.by}</td>
                  <td style={{ color: COLORS.muted, fontSize: 13 }}>{e.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── EXPORT VIEW ──────────────────────────────────────────────────────────────
function ExportView({ goals, allUsers }) {
  function downloadCSV() {
    const rows = [["Employee", "Dept", "Thrust Area", "Goal Title", "UoM", "Target", "Achievement", "Score (%)", "Status", "Goal Status", "Weight (%)"]];
    goals.forEach(g => {
      const emp = allUsers[g.employeeId];
      const score = computeScore(g);
      rows.push([emp?.name, emp?.dept, g.thrustArea, g.title, g.uom, g.target, g.achievement ?? "", score ?? "", g.status, g.goalStatus, g.weightage]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "AtomQuest_Goals_Report.csv"; a.click();
  }

  return (
    <div className="fadeUp">
      <style>{STYLE}</style>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Export Report</h2>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28 }}>Download achievement data for all employees</p>

      <div className="card" style={{ maxWidth: 420 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Achievement Report</div>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>Exports: Employee, Dept, Thrust Area, Goal Title, UoM, Target, Actual Achievement, Score, Status, Weightage</p>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: COLORS.bg, padding: "8px 14px", borderRadius: 8, fontSize: 13 }}>
            <span className="mono" style={{ color: COLORS.muted }}>Rows: </span>
            <span style={{ fontWeight: 700 }}>{goals.length + 1}</span>
          </div>
          <div style={{ background: COLORS.bg, padding: "8px 14px", borderRadius: 8, fontSize: 13 }}>
            <span className="mono" style={{ color: COLORS.muted }}>Format: </span>
            <span style={{ fontWeight: 700 }}>CSV</span>
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: 20, width: "100%" }} onClick={downloadCSV}>
          ↓ Download CSV
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
 const [goals, setGoals] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("atomquest_goals");
    if (saved) return JSON.parse(saved);
  }
  return SEED_GOALS;
});

useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("atomquest_goals", JSON.stringify(goals));
  }
}, [goals]);
  const [view, setView] = useState(null);

  function handleLogin(u) {
    setUser(u);
    const defaultViews = { employee: "my-goals", manager: "team", admin: "admin-dash" };
    setView(defaultViews[u.role]);
  }

  function handleLogout() { setUser(null); setView(null); }

  if (!user) return <Login onLogin={handleLogin} />;

  const MAIN_PAD = { paddingLeft: 254, paddingTop: 0 };

  function renderView() {
    const props = { user, goals, setGoals, allUsers: USERS };
    switch (view) {
      case "my-goals":    return <MyGoalsView {...props} />;
      case "checkin":     return <CheckinView {...props} />;
      case "team":        return <TeamView {...props} />;
      case "approvals":   return <ApprovalsView {...props} />;
      case "mgr-checkin": return <MgrCheckinView {...props} />;
      case "admin-dash":  return <AdminDashView {...props} />;
      case "all-goals":   return <AllGoalsView {...props} />;
      case "push-goal":   return <PushGoalView {...props} />;
      case "cycle":       return <CycleConfigView {...props} />;
      case "org":         return <OrgHierarchyView {...props} />;
      case "audit":       return <AuditView {...props} />;
      case "export":      return <ExportView {...props} />;
      default: return <div style={{ padding: 40, color: COLORS.muted }}>Select a view from the sidebar.</div>;
    }
  }

return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      <style>{STYLE}</style>
      <div style={{ display: "flex", flex: 1, flexDirection: typeof window !== 'undefined' && window.innerWidth <= 768 ? "column" : "row" }}>
        <div className="sidebar-wrap" style={{ zIndex: 10 }}>
          <Sidebar user={user} view={view} setView={setView} onLogout={handleLogout} />
        </div>
       <main className="main-content" style={{ padding: "36px 36px 36px 266px", flex: 1, overflowX: "hidden", minHeight: "100vh" }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
