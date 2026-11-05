import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import bank from "./routes/bank.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_q, r) => r.send("Finova Bank API running"));
app.use("/api/auth", auth);
app.use("/api", bank);
app.use((e, _q, r, _n) => { console.error(e); r.status(e.status || 500).json({ message: e.message || "Server error" }); });

const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;
if (!MONGO_URI || !JWT_SECRET) { console.error("Set MONGO_URI and JWT_SECRET in server/.env"); process.exit(1); }
mongoose.connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch(e => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
