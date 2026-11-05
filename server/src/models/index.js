import mongoose from "mongoose";
const { Schema, model } = mongoose;
const ref = (m) => ({ type: Schema.Types.ObjectId, ref: m, required: true });

export const User = model("User", new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  password: { type: String, required: true },
}, { timestamps: true }), "users");

export const Account = model("Account", new Schema({
  user: ref("User"),
  accountNumber: { type: String, unique: true },
  type: { type: String, default: "Savings" },
  ifsc: { type: String, default: "FINB0001024" },
  branch: { type: String, default: "Hyderabad Main Branch" },
  balance: { type: Number, default: 0, min: 0 },
}, { timestamps: true }), "accounts");

export const Transaction = model("Transaction", new Schema({
  account: ref("Account"),
  type: { type: String, enum: ["CR", "DR"], required: true },
  amount: { type: Number, required: true },
  balanceAfter: Number,
  mode: { type: String, default: "IMPS" },
  remarks: String,
  counterparty: String,
}, { timestamps: true }), "transactions");

export const Beneficiary = model("Beneficiary", new Schema({
  user: ref("User"),
  name: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifsc: String,
}, { timestamps: true }), "beneficiaries");
