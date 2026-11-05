import { Router } from "express";
import { Account, Transaction, Beneficiary } from "../models/index.js";
import guard from "../middleware/auth.js";

const r = Router();
r.use(guard);
const wrap = (f) => (q, s, n) => f(q, s, n).catch(n);
const bad = (res, m, c = 400) => res.status(c).json({ message: m });
const amt = (v) => { const n = Math.round(Number(v) * 100) / 100; return n > 0 && n <= 1000000 ? n : null; };
const mine = (req) => Account.findOne({ user: req.userId });

r.get("/account", wrap(async (req, res) => res.json(await mine(req))));

r.get("/transactions", wrap(async (req, res) => {
  const acc = await mine(req);
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  res.json(await Transaction.find({ account: acc._id }).sort({ createdAt: -1 }).limit(limit));
}));

r.post("/deposit", wrap(async (req, res) => {
  const a = amt(req.body.amount); if (!a) return bad(res, "Enter a valid amount");
  const acc = await Account.findOneAndUpdate({ user: req.userId }, { $inc: { balance: a } }, { new: true });
  await Transaction.create({ account: acc._id, type: "CR", amount: a, balanceAfter: acc.balance, mode: "CASH", remarks: "Cash deposit" });
  res.json(acc);
}));

r.post("/withdraw", wrap(async (req, res) => {
  const a = amt(req.body.amount); if (!a) return bad(res, "Enter a valid amount");
  const acc = await Account.findOneAndUpdate({ user: req.userId, balance: { $gte: a } }, { $inc: { balance: -a } }, { new: true });
  if (!acc) return bad(res, "Insufficient balance");
  await Transaction.create({ account: acc._id, type: "DR", amount: a, balanceAfter: acc.balance, mode: "CASH", remarks: "Cash withdrawal" });
  res.json(acc);
}));

r.get("/beneficiaries", wrap(async (req, res) => res.json(await Beneficiary.find({ user: req.userId }).sort({ name: 1 }))));

r.post("/beneficiaries", wrap(async (req, res) => {
  const { name, accountNumber } = req.body;
  if (!name || !accountNumber) return bad(res, "Name and account number are required");
  const target = await Account.findOne({ accountNumber });
  if (!target) return bad(res, "Account number not found in Finova Bank");
  if (target.user.equals(req.userId)) return bad(res, "You cannot add your own account");
  res.status(201).json(await Beneficiary.create({ user: req.userId, name, accountNumber, ifsc: target.ifsc }));
}));

r.delete("/beneficiaries/:id", wrap(async (req, res) => {
  await Beneficiary.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ ok: true });
}));

r.post("/transfer", wrap(async (req, res) => {
  const { toAccount, mode = "IMPS", remarks = "" } = req.body;
  const a = amt(req.body.amount); if (!a) return bad(res, "Enter a valid amount");
  const to = await Account.findOne({ accountNumber: toAccount });
  const from = await mine(req);
  if (!to) return bad(res, "Beneficiary account not found");
  if (to._id.equals(from._id)) return bad(res, "Cannot transfer to the same account");
  const debited = await Account.findOneAndUpdate({ _id: from._id, balance: { $gte: a } }, { $inc: { balance: -a } }, { new: true });
  if (!debited) return bad(res, "Insufficient balance");
  const credited = await Account.findByIdAndUpdate(to._id, { $inc: { balance: a } }, { new: true });
  await Transaction.create([
    { account: from._id, type: "DR", amount: a, balanceAfter: debited.balance, mode, remarks, counterparty: toAccount },
    { account: to._id, type: "CR", amount: a, balanceAfter: credited.balance, mode, remarks, counterparty: from.accountNumber },
  ]);
  res.json({ message: "Transfer successful", balance: debited.balance, ref: Date.now().toString().slice(-10) });
}));
export default r;
