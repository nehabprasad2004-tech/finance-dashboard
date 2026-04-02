import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2024-01-05", description: "Salary",           category: "Income",        type: "income",  amount: 5200 },
  { id: 2,  date: "2024-01-08", description: "Rent",             category: "Housing",       type: "expense", amount: 1400 },
  { id: 3,  date: "2024-01-10", description: "Grocery Store",    category: "Food",          type: "expense", amount: 210 },
  { id: 4,  date: "2024-01-12", description: "Netflix",          category: "Entertainment", type: "expense", amount: 18 },
  { id: 5,  date: "2024-01-14", description: "Freelance Work",   category: "Income",        type: "income",  amount: 900 },
  { id: 6,  date: "2024-01-16", description: "Electricity Bill", category: "Utilities",     type: "expense", amount: 95 },
  { id: 7,  date: "2024-01-18", description: "Restaurant",       category: "Food",          type: "expense", amount: 74 },
  { id: 8,  date: "2024-01-20", description: "Gym Membership",   category: "Health",        type: "expense", amount: 45 },
  { id: 9,  date: "2024-01-22", description: "Amazon Purchase",  category: "Shopping",      type: "expense", amount: 132 },
  { id: 10, date: "2024-01-25", description: "Gas Station",      category: "Transport",     type: "expense", amount: 60 },
  { id: 11, date: "2024-02-03", description: "Salary",           category: "Income",        type: "income",  amount: 5200 },
  { id: 12, date: "2024-02-05", description: "Rent",             category: "Housing",       type: "expense", amount: 1400 },
  { id: 13, date: "2024-02-07", description: "Coffee Shop",      category: "Food",          type: "expense", amount: 42 },
  { id: 14, date: "2024-02-10", description: "Internet Bill",    category: "Utilities",     type: "expense", amount: 65 },
  { id: 15, date: "2024-02-12", description: "Bonus",            category: "Income",        type: "income",  amount: 700 },
  { id: 16, date: "2024-02-15", description: "Pharmacy",         category: "Health",        type: "expense", amount: 38 },
  { id: 17, date: "2024-02-18", description: "Cinema",           category: "Entertainment", type: "expense", amount: 29 },
  { id: 18, date: "2024-02-20", description: "Grocery Store",    category: "Food",          type: "expense", amount: 185 },
  { id: 19, date: "2024-02-23", description: "Uber",             category: "Transport",     type: "expense", amount: 34 },
  { id: 20, date: "2024-02-26", description: "Online Course",    category: "Education",     type: "expense", amount: 89 },
  { id: 21, date: "2024-03-02", description: "Salary",           category: "Income",        type: "income",  amount: 5200 },
  { id: 22, date: "2024-03-04", description: "Rent",             category: "Housing",       type: "expense", amount: 1400 },
  { id: 23, date: "2024-03-07", description: "Restaurant",       category: "Food",          type: "expense", amount: 88 },
  { id: 24, date: "2024-03-10", description: "Freelance Work",   category: "Income",        type: "income",  amount: 1200 },
  { id: 25, date: "2024-03-13", description: "Clothing Store",   category: "Shopping",      type: "expense", amount: 210 },
  { id: 26, date: "2024-03-16", description: "Gas Station",      category: "Transport",     type: "expense", amount: 55 },
  { id: 27, date: "2024-03-18", description: "Spotify",          category: "Entertainment", type: "expense", amount: 10 },
  { id: 28, date: "2024-03-20", description: "Electricity Bill", category: "Utilities",     type: "expense", amount: 88 },
  { id: 29, date: "2024-03-22", description: "Doctor Visit",     category: "Health",        type: "expense", amount: 120 },
  { id: 30, date: "2024-03-25", description: "Amazon Purchase",  category: "Shopping",      type: "expense", amount: 67 },
];

const MONTHLY_TREND = [
  { month: "Jan", income: 6100, expenses: 2034, balance: 4066 },
  { month: "Feb", income: 5900, expenses: 1882, balance: 4018 },
  { month: "Mar", income: 6400, expenses: 2038, balance: 4362 },
];

const CATEGORY_COLORS = {
  Housing:       "#6366f1",
  Food:          "#f59e0b",
  Entertainment: "#ec4899",
  Utilities:     "#14b8a6",
  Health:        "#10b981",
  Shopping:      "#f97316",
  Transport:     "#3b82f6",
  Education:     "#8b5cf6",
  Income:        "#22c55e",
};

const CATEGORIES = ["All", "Income", "Housing", "Food", "Entertainment", "Utilities", "Health", "Shopping", "Transport", "Education"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtSmall = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    dashboard:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    transactions:  "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 1 1 2 2",
    insights:      "M18 20V10 M12 20V4 M6 20v-6",
    wallet:        "M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a1 1 0 0 0 0 2 1 1 0 0 0 0-2",
    income:        "M12 19V5 M5 12l7-7 7 7",
    expense:       "M12 5v14 M19 12l-7 7-7-7",
    add:           "M12 5v14 M5 12h14",
    edit:          "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash:         "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    search:        "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
    close:         "M18 6L6 18 M6 6l12 12",
    chevronUp:     "M18 15l-6-6-6 6",
    chevronDown:   "M6 9l6 6 6-6",
    sparkle:       "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]?.split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

// ─── ADD/EDIT MODAL ───────────────────────────────────────────────────────────
function TransactionModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState(transaction || {
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "Food",
    type: "expense",
    amount: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount), id: transaction?.id || Date.now() });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{transaction ? "Edit Transaction" : "Add Transaction"}</span>
          <button style={styles.iconBtn} onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        <div style={styles.formGrid}>
          {[
            { label: "Description", key: "description", type: "text" },
            { label: "Amount ($)", key: "amount", type: "number" },
            { label: "Date", key: "date", type: "date" },
          ].map(({ label, key, type }) => (
            <div key={key} style={styles.formGroup}>
              <label style={styles.label}>{label}</label>
              <input style={styles.input} type={type} value={form[key]}
                onChange={e => set(key, e.target.value)} />
            </div>
          ))}

          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <div style={styles.toggleRow}>
              {["income", "expense"].map(t => (
                <button key={t} style={{ ...styles.toggleBtn, ...(form.type === t ? styles.toggleActive : {}) }}
                  onClick={() => set("type", t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select style={styles.input} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUMMARY CARD ─────────────────────────────────────────────────────────────
function SummaryCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={styles.cardTop}>
        <div style={{ ...styles.iconWrap, background: color + "22", color }}>
          <Icon name={icon} size={20} color={color} />
        </div>
        <span style={styles.cardLabel}>{label}</span>
      </div>
      <div style={styles.cardValue}>{value}</div>
      {sub && <div style={styles.cardSub}>{sub}</div>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [role, setRole] = useState("admin");
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [modal, setModal] = useState(null); // null | "add" | transaction object
  const [darkMode, setDarkMode] = useState(true);

  const isAdmin = role === "admin";

  // ── derived stats ──
  const totalIncome   = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance       = totalIncome - totalExpenses;

  // spending by category
  const spendingByCategory = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const topCategory = spendingByCategory[0];

  // filtered & sorted transactions
  const filtered = useMemo(() => {
    let list = transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.category.toLowerCase().includes(search.toLowerCase());
      const matchCat  = filterCat === "All"  || t.category === filterCat;
      const matchType = filterType === "All" || t.type === filterType;
      return matchSearch && matchCat && matchType;
    });
    list.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [transactions, search, filterCat, filterType, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleSave = (tx) => {
    setTransactions(prev =>
      tx.id && prev.find(t => t.id === tx.id)
        ? prev.map(t => t.id === tx.id ? tx : t)
        : [...prev, tx]
    );
    setModal(null);
  };

  const handleDelete = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const dm = darkMode; // shorthand

  // ── nav items ──
  const navItems = [
    { id: "dashboard",    label: "Overview",     icon: "dashboard" },
    { id: "transactions", label: "Transactions", icon: "transactions" },
    { id: "insights",     label: "Insights",     icon: "insights" },
  ];

  return (
    <div style={{ ...styles.root, background: dm ? "#0f1117" : "#f4f6fb", color: dm ? "#e8eaf0" : "#1a1d2e", minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ ...styles.sidebar, background: dm ? "#161a25" : "#fff", borderRight: dm ? "1px solid #1e2435" : "1px solid #e5e7ef" }}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}><Icon name="wallet" size={18} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>FinFlow</span>
        </div>

        <nav style={styles.nav}>
          {navItems.map(item => (
            <button key={item.id}
              style={{ ...styles.navBtn, ...(tab === item.id ? styles.navBtnActive : {}) }}
              onClick={() => setTab(item.id)}>
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.roleBox}>
            <div style={styles.roleLabel}>Active Role</div>
            <select style={{ ...styles.select, background: dm ? "#1e2435" : "#f0f2f8" }}
              value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button style={styles.darkToggle} onClick={() => setDarkMode(d => !d)}>
            {dm ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              {navItems.find(n => n.id === tab)?.label}
            </h1>
            <p style={{ color: dm ? "#8891aa" : "#6b7280", fontSize: 13, marginTop: 2 }}>
              {tab === "dashboard" && "Your financial snapshot at a glance"}
              {tab === "transactions" && "All your recorded transactions"}
              {tab === "insights" && "Understand your spending patterns"}
            </p>
          </div>
          <div style={styles.headerRight}>
            {!isAdmin && (
              <span style={styles.viewerBadge}>👁 Viewer Mode</span>
            )}
            {isAdmin && tab === "transactions" && (
              <button style={styles.btnPrimary} onClick={() => setModal("add")}>
                <Icon name="add" size={15} color="#fff" /> Add Transaction
              </button>
            )}
          </div>
        </header>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div style={styles.content}>
            <div style={styles.summaryGrid}>
              <SummaryCard label="Total Balance" value={fmt(balance)}   icon="wallet"  color="#6366f1" sub="All time net" />
              <SummaryCard label="Total Income"  value={fmt(totalIncome)}  icon="income"  color="#10b981" sub={`${transactions.filter(t=>t.type==="income").length} transactions`} />
              <SummaryCard label="Total Expenses" value={fmt(totalExpenses)} icon="expense" color="#f43f5e" sub={`${transactions.filter(t=>t.type==="expense").length} transactions`} />
            </div>

            <div style={styles.chartsRow}>
              <div style={{ ...styles.chartCard, flex: 2, background: dm ? "#161a25" : "#fff" }}>
                <h3 style={styles.chartTitle}>Balance Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#1e2435" : "#eee"} />
                    <XAxis dataKey="month" stroke={dm ? "#555d78" : "#aaa"} tick={{ fontSize: 12 }} />
                    <YAxis stroke={dm ? "#555d78" : "#aaa"} tick={{ fontSize: 12 }} tickFormatter={v => `$${v/1000}k`} />
                    <Tooltip contentStyle={{ background: dm ? "#1e2435" : "#fff", border: "1px solid #2e3550", borderRadius: 8, fontSize: 13 }}
                      formatter={(v, n) => [fmt(v), n]} />
                    <Area type="monotone" dataKey="income"   stroke="#6366f1" fill="url(#gIncome)"  strokeWidth={2} name="Income" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#gExpense)" strokeWidth={2} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ ...styles.chartCard, flex: 1, background: dm ? "#161a25" : "#fff" }}>
                <h3 style={styles.chartTitle}>Spending by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      paddingAngle={3} dataKey="value">
                      {spendingByCategory.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: dm ? "#1e2435" : "#fff", border: "1px solid #2e3550", borderRadius: 8, fontSize: 13 }}
                      formatter={(v) => [fmt(v)]} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ ...styles.chartCard, background: dm ? "#161a25" : "#fff" }}>
              <h3 style={styles.chartTitle}>Monthly Comparison</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MONTHLY_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#1e2435" : "#eee"} />
                  <XAxis dataKey="month" stroke={dm ? "#555d78" : "#aaa"} tick={{ fontSize: 12 }} />
                  <YAxis stroke={dm ? "#555d78" : "#aaa"} tick={{ fontSize: 12 }} tickFormatter={v => `$${v/1000}k`} />
                  <Tooltip contentStyle={{ background: dm ? "#1e2435" : "#fff", border: "1px solid #2e3550", borderRadius: 8, fontSize: 13 }}
                    formatter={(v, n) => [fmt(v), n]} />
                  <Bar dataKey="income"   fill="#6366f1" radius={[4,4,0,0]} name="Income" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4,4,0,0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "transactions" && (
          <div style={styles.content}>
            {/* Filters */}
            <div style={{ ...styles.filterBar, background: dm ? "#161a25" : "#fff" }}>
              <div style={styles.searchWrap}>
                <Icon name="search" size={15} color={dm ? "#555d78" : "#9ca3af"} />
                <input style={{ ...styles.searchInput, background: "transparent", color: dm ? "#e8eaf0" : "#1a1d2e" }}
                  placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select style={{ ...styles.select, background: dm ? "#1e2435" : "#f0f2f8" }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select style={{ ...styles.select, background: dm ? "#1e2435" : "#f0f2f8" }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                {["All", "income", "expense"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>

            {/* Table */}
            <div style={{ ...styles.tableWrap, background: dm ? "#161a25" : "#fff" }}>
              {filtered.length === 0 ? (
                <div style={styles.empty}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No transactions found</div>
                  <div style={{ fontSize: 13, color: dm ? "#555d78" : "#9ca3af" }}>Try adjusting your filters</div>
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${dm ? "#1e2435" : "#e5e7ef"}` }}>
                      {[["date","Date"],["description","Description"],["category","Category"],["amount","Amount"],["type","Type"]].map(([key, label]) => (
                        <th key={key} style={styles.th} onClick={() => handleSort(key)}>
                          <span style={styles.thInner}>
                            {label}
                            {sortKey === key && <Icon name={sortDir === "asc" ? "chevronUp" : "chevronDown"} size={12} />}
                          </span>
                        </th>
                      ))}
                      {isAdmin && <th style={styles.th}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(tx => (
                      <tr key={tx.id} style={{ borderBottom: `1px solid ${dm ? "#1a1f30" : "#f0f2f8"}`, transition: "background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = dm ? "#1a1f30" : "#f8f9ff"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={styles.td}>{tx.date}</td>
                        <td style={{ ...styles.td, fontWeight: 500 }}>{tx.description}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.catBadge, background: (CATEGORY_COLORS[tx.category] || "#8884d8") + "22", color: CATEGORY_COLORS[tx.category] || "#8884d8" }}>
                            {tx.category}
                          </span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: 600, color: tx.type === "income" ? "#10b981" : "#f43f5e" }}>
                          {tx.type === "income" ? "+" : "-"}{fmtSmall(tx.amount)}
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.typeBadge, background: tx.type === "income" ? "#10b98122" : "#f43f5e22", color: tx.type === "income" ? "#10b981" : "#f43f5e" }}>
                            {tx.type}
                          </span>
                        </td>
                        {isAdmin && (
                          <td style={styles.td}>
                            <div style={styles.actions}>
                              <button style={styles.iconBtn} title="Edit" onClick={() => setModal(tx)}><Icon name="edit" size={14} /></button>
                              <button style={{ ...styles.iconBtn, color: "#f43f5e" }} title="Delete" onClick={() => handleDelete(tx.id)}><Icon name="trash" size={14} /></button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ fontSize: 12, color: dm ? "#555d78" : "#9ca3af", marginTop: 8 }}>
              Showing {filtered.length} of {transactions.length} transactions
            </div>
          </div>
        )}

        {/* ── INSIGHTS TAB ── */}
        {tab === "insights" && (
          <div style={styles.content}>
            <div style={styles.insightGrid}>
              {[
                { icon: "sparkle", color: "#f59e0b", label: "Top Spending Category", value: topCategory?.name, sub: `${fmt(topCategory?.value)} spent` },
                { icon: "income", color: "#10b981", label: "Best Income Month", value: "March 2024", sub: `${fmt(6400)} earned` },
                { icon: "expense", color: "#f43f5e", label: "Avg Monthly Expense", value: fmt((totalExpenses / 3)), sub: "Over 3 months" },
                { icon: "wallet", color: "#6366f1", label: "Savings Rate", value: `${Math.round((balance / totalIncome) * 100)}%`, sub: "Income saved" },
              ].map(({ icon, color, label, value, sub }) => (
                <div key={label} style={{ ...styles.insightCard, background: dm ? "#161a25" : "#fff", borderLeft: `4px solid ${color}` }}>
                  <div style={{ ...styles.iconWrap, background: color + "22", color, marginBottom: 12 }}>
                    <Icon name={icon} size={20} color={color} />
                  </div>
                  <div style={{ fontSize: 12, color: dm ? "#8891aa" : "#6b7280", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 12, color: dm ? "#555d78" : "#9ca3af" }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ ...styles.chartCard, background: dm ? "#161a25" : "#fff" }}>
              <h3 style={styles.chartTitle}>Top Spending Categories</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={spendingByCategory.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dm ? "#1e2435" : "#eee"} horizontal={false} />
                  <XAxis type="number" stroke={dm ? "#555d78" : "#aaa"} tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                  <YAxis type="category" dataKey="name" stroke={dm ? "#555d78" : "#aaa"} tick={{ fontSize: 12 }} width={90} />
                  <Tooltip contentStyle={{ background: dm ? "#1e2435" : "#fff", border: "1px solid #2e3550", borderRadius: 8, fontSize: 13 }}
                    formatter={(v) => [fmt(v)]} />
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {spendingByCategory.slice(0,6).map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#8884d8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...styles.chartCard, background: dm ? "#161a25" : "#fff" }}>
              <h3 style={styles.chartTitle}>Monthly Income vs Expenses</h3>
              <div style={styles.monthComparisons}>
                {MONTHLY_TREND.map(m => (
                  <div key={m.month} style={{ ...styles.monthCard, background: dm ? "#1a1f30" : "#f8f9ff" }}>
                    <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>{m.month}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#10b981" }}>Income</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>{fmt(m.income)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "#f43f5e" }}>Expenses</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#f43f5e" }}>{fmt(m.expenses)}</span>
                    </div>
                    <div style={{ background: dm ? "#1e2435" : "#e5e7ef", height: 4, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${(m.expenses / m.income) * 100}%`, background: "#f43f5e", height: "100%", borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 11, color: dm ? "#555d78" : "#9ca3af", marginTop: 4 }}>
                      {Math.round((m.expenses / m.income) * 100)}% spent
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {modal && (
        <TransactionModal
          transaction={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  root: { display: "flex", minHeight: "100vh" },
  sidebar: { width: 220, display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh", flexShrink: 0 },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "0 4px" },
  brandIcon: { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#8891aa", cursor: "pointer", fontSize: 14, fontWeight: 500, textAlign: "left", transition: "all .15s" },
  navBtnActive: { background: "linear-gradient(135deg,#6366f122,#818cf811)", color: "#818cf8", fontWeight: 600 },
  sidebarBottom: { display: "flex", flexDirection: "column", gap: 10 },
  roleBox: { background: "#1e243522", borderRadius: 8, padding: "10px 12px" },
  roleLabel: { fontSize: 11, color: "#555d78", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" },
  select: { width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #2e3550", color: "inherit", fontSize: 13, cursor: "pointer" },
  darkToggle: { padding: "8px 12px", borderRadius: 6, border: "1px solid #2e355044", background: "transparent", color: "#8891aa", cursor: "pointer", fontSize: 12, fontWeight: 500 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px 0", flexShrink: 0 },
  pageTitle: { fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", margin: 0 },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  viewerBadge: { fontSize: 12, padding: "5px 10px", borderRadius: 20, background: "#f59e0b22", color: "#f59e0b", fontWeight: 600 },
  content: { padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 16, flex: 1, overflowY: "auto" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  card: { borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, background: "inherit" },
  cardTop: { display: "flex", alignItems: "center", gap: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardLabel: { fontSize: 13, fontWeight: 500, opacity: 0.7 },
  cardValue: { fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" },
  cardSub: { fontSize: 12, opacity: 0.5 },
  chartsRow: { display: "flex", gap: 14 },
  chartCard: { borderRadius: 12, padding: "18px 20px" },
  chartTitle: { fontSize: 14, fontWeight: 600, marginBottom: 16, opacity: 0.85, margin: "0 0 16px 0" },
  filterBar: { display: "flex", gap: 10, padding: "14px 16px", borderRadius: 12, alignItems: "center", flexWrap: "wrap" },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 180, background: "#1e243522", borderRadius: 8, padding: "7px 12px", border: "1px solid #2e355044" },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 14 },
  tableWrap: { borderRadius: 12, overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "13px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, opacity: 0.6, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" },
  thInner: { display: "flex", alignItems: "center", gap: 4 },
  td: { padding: "12px 16px", verticalAlign: "middle" },
  catBadge: { padding: "3px 8px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  typeBadge: { padding: "3px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize" },
  actions: { display: "flex", gap: 4 },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", padding: 5, borderRadius: 6, color: "#8891aa", display: "flex", alignItems: "center", justifyContent: "center" },
  empty: { padding: "60px 20px", textAlign: "center", opacity: 0.6 },
  insightGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  insightCard: { borderRadius: 12, padding: "18px 20px" },
  monthComparisons: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 16 },
  monthCard: { borderRadius: 8, padding: "14px 16px" },
  overlay: { position: "fixed", inset: 0, background: "#00000080", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
  modal: { background: "#161a25", borderRadius: 16, padding: 24, width: 420, maxWidth: "90vw", boxShadow: "0 25px 80px #0008", border: "1px solid #2e3550" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  modalTitle: { fontWeight: 700, fontSize: 16 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.4px" },
  input: { padding: "9px 12px", borderRadius: 8, border: "1px solid #2e3550", background: "#1e2435", color: "#e8eaf0", fontSize: 14, outline: "none" },
  toggleRow: { display: "flex", gap: 6 },
  toggleBtn: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #2e3550", background: "transparent", color: "#8891aa", cursor: "pointer", fontSize: 13, fontWeight: 500 },
  toggleActive: { background: "#6366f122", borderColor: "#6366f1", color: "#818cf8" },
  modalFooter: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnPrimary: { padding: "9px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  btnSecondary: { padding: "9px 18px", borderRadius: 8, border: "1px solid #2e3550", background: "transparent", color: "#8891aa", cursor: "pointer", fontSize: 14, fontWeight: 500 },
};