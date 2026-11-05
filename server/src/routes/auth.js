import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Account, Transaction } from "../models/index.js";
import guard from "../middleware/auth.js";

const r = Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
const accNo = () => "4" + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
const wrap = (f) => (q, s, n) => f(q, s, n).catch(n);

r.post("/register", wrap(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: "Name, email and a password of 6+ characters are required" });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "User already registered" });
  const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 10) });
  const acc = await Account.create({ user: user._id, accountNumber: accNo(), balance: 1000 });
  await Transaction.create({ account: acc._id, type: "CR", amount: 1000, balanceAfter: 1000, mode: "CASH", remarks: "Account opening deposit" });
  res.status(201).json({ token: sign(user), user: { name: user.name, email: user.email } });
}));

r.post("/login", wrap(async (req, res) => {
  const user = await User.findOne({ email: (req.body.email || "").toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(401).json({ message: "Invalid user ID or password" });
  res.json({ token: sign(user), user: { name: user.name, email: user.email } });
}));

r.get("/me", guard, wrap(async (req, res) => res.json(await User.findById(req.userId).select("-password"))));
export default r;
