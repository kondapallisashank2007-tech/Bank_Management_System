import { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from "react-router-dom";
import { api, inr, dt } from "./api.js";

const authed = () => !!localStorage.getItem("token");
const Msg = ({ m }) => m ? <div className={"msg " + (m.ok ? "ok" : "err")}>{m.text}</div> : null;

function Brand() {
  return <div className="brand"><div className="logo">F</div><div><b>Finova Bank</b><small>Retail Internet Banking</small></div></div>;
}

function AuthPage({ register }) {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [m, setM] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      const d = await api(register ? "/auth/register" : "/auth/login", "POST", f);
      localStorage.setItem("token", d.token); localStorage.setItem("name", d.user.name);
      nav("/");
    } catch (er) { setM({ text: er.message }); }
  };
  return (
    <div className="login-page">
      <header className="top"><Brand /><span className="helpline">Helpline 1800 1234 (toll free)</span></header>
      <div className="login-wrap">
        <section className="notice">
          <h2>Important notices</h2>
          <ul>
            <li>Finova Bank never asks for your password, OTP or PIN over phone, SMS or email.</li>
            <li>Always check the address bar and logout after each session.</li>
            <li>Demo application: money shown here is not real.</li>
          </ul>
        </section>
        <form className="panel login" onSubmit={submit}>
          <h3>{register ? "New User Registration" : "Personal Banking Login"}</h3>
          {register && <><label>Full name<input value={f.name} onChange={set("name")} required /></label>
          <label>Mobile number<input value={f.phone} onChange={set("phone")} /></label></>}
          <label>User ID (email)<input type="email" value={f.email} onChange={set("email")} required /></label>
          <label>Password<input type="password" value={f.password} onChange={set("password")} required /></label>
          <Msg m={m} />
          <button className="btn">{register ? "Register" : "Login"}</button>
          <p className="alt">{register ? <a href="/login">Back to login</a> : <a href="/register">New user? Register here</a>}</p>
        </form>
      </div>
    </div>
  );
}

function Shell({ children }) {
  const nav = useNavigate();
  const links = [["/", "Account Summary"], ["/transfer", "Fund Transfer"], ["/beneficiaries", "Payees"], ["/statement", "Account Statement"], ["/cash", "Deposit / Withdraw"]];
  return (
    <div>
      <header className="top"><Brand />
        <div className="who">Welcome, <b>{localStorage.getItem("name")}</b>
          <button className="link" onClick={() => { localStorage.clear(); nav("/login"); }}>Logout</button></div>
      </header>
      <nav className="menu">{links.map(([to, t]) => <NavLink key={to} to={to} end>{t}</NavLink>)}</nav>
      <main className="page">{children}</main>
      <footer>© Finova Bank · Demo project · Last login this session</footer>
    </div>
  );
}

function Summary() {
  const [acc, setAcc] = useState(null);
  const [tx, setTx] = useState([]);
  useEffect(() => { api("/account").then(setAcc); api("/transactions?limit=5").then(setTx); }, []);
  if (!acc) return <p>Loading…</p>;
  return (<>
    <h2>Account Summary</h2>
    <table className="grid">
      <thead><tr><th>Account No.</th><th>Type</th><th>Branch</th><th>IFSC</th><th className="r">Available Balance</th></tr></thead>
      <tbody><tr><td>{acc.accountNumber}</td><td>{acc.type}</td><td>{acc.branch}</td><td>{acc.ifsc}</td><td className="r strong">{inr(acc.balance)}</td></tr></tbody>
    </table>
    <h3>Mini Statement (last 5)</h3>
    <TxTable rows={tx} />
  </>);
}

function TxTable({ rows }) {
  if (!rows.length) return <p>No transactions found.</p>;
  return (
    <div className="scroll"><table className="grid">
      <thead><tr><th>Date</th><th>Mode</th><th>Description</th><th className="r">Debit</th><th className="r">Credit</th><th className="r">Balance</th></tr></thead>
      <tbody>{rows.map((t) => (
        <tr key={t._id}><td>{dt(t.createdAt)}</td><td>{t.mode}</td>
          <td>{t.remarks || "—"}{t.counterparty ? ` (${t.counterparty})` : ""}</td>
          <td className="r dr">{t.type === "DR" ? inr(t.amount) : ""}</td>
          <td className="r cr">{t.type === "CR" ? inr(t.amount) : ""}</td>
          <td className="r">{inr(t.balanceAfter)}</td></tr>))}</tbody>
    </table></div>);
}

function Statement() {
  const [tx, setTx] = useState([]);
  useEffect(() => { api("/transactions?limit=200").then(setTx); }, []);
  return <><h2>Account Statement</h2><TxTable rows={tx} /></>;
}

function Transfer() {
  const [bens, setBens] = useState([]);
  const [f, setF] = useState({ toAccount: "", amount: "", mode: "IMPS", remarks: "" });
  const [m, setM] = useState(null);
  useEffect(() => { api("/beneficiaries").then(setBens); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async (e) => {
    e.preventDefault();
    try { const d = await api("/transfer", "POST", f); setM({ ok: true, text: `${d.message}. Ref no. ${d.ref}. Balance ${inr(d.balance)}` }); setF({ ...f, amount: "", remarks: "" }); }
    catch (er) { setM({ text: er.message }); }
  };
  return (<>
    <h2>Fund Transfer</h2>
    <form className="panel form" onSubmit={go}>
      <label>Transfer to (registered payee)
        <select value={f.toAccount} onChange={set("toAccount")} required>
          <option value="">-- Select payee --</option>
          {bens.map((b) => <option key={b._id} value={b.accountNumber}>{b.name} · {b.accountNumber}</option>)}
        </select></label>
      <label>Mode<select value={f.mode} onChange={set("mode")}><option>IMPS</option><option>NEFT</option><option>RTGS</option></select></label>
      <label>Amount (₹)<input type="number" min="1" step="0.01" value={f.amount} onChange={set("amount")} required /></label>
      <label>Remarks<input maxLength="40" value={f.remarks} onChange={set("remarks")} /></label>
      <Msg m={m} /><button className="btn">Pay Now</button>
      {!bens.length && <p className="alt">No payees yet. Add one under <a href="/beneficiaries">Payees</a>.</p>}
    </form></>);
}

function Payees() {
  const [bens, setBens] = useState([]);
  const [f, setF] = useState({ name: "", accountNumber: "" });
  const [m, setM] = useState(null);
  const load = () => api("/beneficiaries").then(setBens);
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault();
    try { await api("/beneficiaries", "POST", f); setF({ name: "", accountNumber: "" }); setM({ ok: true, text: "Payee added" }); load(); }
    catch (er) { setM({ text: er.message }); }
  };
  return (<>
    <h2>Manage Payees</h2>
    <form className="panel form" onSubmit={add}>
      <label>Payee name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label>
      <label>Account number<input value={f.accountNumber} onChange={(e) => setF({ ...f, accountNumber: e.target.value })} required /></label>
      <Msg m={m} /><button className="btn">Add Payee</button>
    </form>
    <table className="grid"><thead><tr><th>Name</th><th>Account No.</th><th>IFSC</th><th></th></tr></thead>
      <tbody>{bens.map((b) => <tr key={b._id}><td>{b.name}</td><td>{b.accountNumber}</td><td>{b.ifsc}</td>
        <td className="r"><button className="link" onClick={async () => { await api("/beneficiaries/" + b._id, "DELETE"); load(); }}>Delete</button></td></tr>)}</tbody></table>
  </>);
}

function Cash() {
  const [amount, setAmount] = useState("");
  const [m, setM] = useState(null);
  const run = (p) => async () => {
    try { const a = await api(p, "POST", { amount }); setM({ ok: true, text: "Done. New balance " + inr(a.balance) }); setAmount(""); }
    catch (er) { setM({ text: er.message }); }
  };
  return (<><h2>Deposit / Withdraw (demo)</h2>
    <div className="panel form">
      <label>Amount (₹)<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
      <Msg m={m} />
      <div className="row"><button className="btn" onClick={run("/deposit")}>Deposit</button><button className="btn ghost" onClick={run("/withdraw")}>Withdraw</button></div>
    </div></>);
}

// Checked at render time (and re-checked on every navigation via useLocation),
// so the token saved at login is picked up when we navigate to "/".
function Protected({ children }) {
  useLocation();
  return authed() ? <Shell>{children}</Shell> : <Navigate to="/login" replace />;
}

export default function App() {
  const page = (el) => <Protected>{el}</Protected>;
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage register />} />
      <Route path="/" element={page(<Summary />)} />
      <Route path="/transfer" element={page(<Transfer />)} />
      <Route path="/beneficiaries" element={page(<Payees />)} />
      <Route path="/statement" element={page(<Statement />)} />
      <Route path="/cash" element={page(<Cash />)} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
