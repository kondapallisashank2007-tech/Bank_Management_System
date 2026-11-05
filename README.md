<div align="center">

# 🏦 Finova Bank

### A full-stack Retail Internet Banking application built with the MERN stack

**MongoDB · Express.js · React · Node.js**

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Purpose-Educational%20Demo-orange)

</div>

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [System Architecture](#-system-architecture)
5. [Project Structure](#-project-structure)
6. [Prerequisites](#-prerequisites)
7. [Installation and Setup](#-installation-and-setup)
8. [Environment Variables](#-environment-variables)
9. [Running the Application](#-running-the-application)
10. [How to Use the Application](#-how-to-use-the-application)
11. [API Reference](#-api-reference)
12. [Database Design](#-database-design)
13. [Business Rules and Validations](#-business-rules-and-validations)
14. [Security Implementation](#-security-implementation)
15. [Troubleshooting](#-troubleshooting)
16. [Known Limitations](#-known-limitations)
17. [Future Enhancements](#-future-enhancements)
18. [Disclaimer](#-disclaimer)

---

## 📖 Overview

**Finova Bank** is a net-banking style web application that simulates the everyday operations of a retail bank. A customer can register, receive a savings account, view balances and statements, manage payees, and transfer money to other Finova customers using familiar payment modes such as **IMPS, NEFT and RTGS**.

The project demonstrates how a complete banking workflow can be built end to end:

- A **React** single-page application provides a classic, professional internet-banking interface.
- An **Express** REST API handles authentication, account operations and fund transfers.
- **MongoDB** stores users, accounts, transactions and payees.
- **JSON Web Tokens (JWT)** protect every private endpoint.

> 💡 This is a learning and demonstration project. All money shown is virtual.

---

## ✨ Key Features

### 🔐 Authentication and Access
| Feature | Description |
|---|---|
| User registration | Create an account with name, mobile number, email and password |
| Secure login | Email (User ID) and password authentication |
| Password hashing | Passwords are stored as bcrypt hashes, never as plain text |
| Token-based sessions | JWT issued at login, valid for **2 hours** |
| Protected routes | Dashboard pages are inaccessible without a valid session |
| Auto logout | Expired or invalid tokens redirect the user to the login page |

### 💰 Banking Operations
| Feature | Description |
|---|---|
| Automatic account opening | A Savings account with a unique 11-digit number is created at registration |
| Welcome deposit | Every new account starts with **₹1,000** |
| Account summary | Account number, type, branch, IFSC code and available balance |
| Mini statement | The five most recent transactions on the dashboard |
| Full statement | Up to 200 most recent transactions, newest first |
| Deposit and withdraw | Demo cash operations with balance checks |
| Fund transfer | Send money to registered payees via IMPS, NEFT or RTGS |
| Payee management | Add or delete beneficiaries after account-number verification |
| Transaction reference | A reference number is returned after every successful transfer |

### 🎨 User Interface
- Traditional net-banking look with a branded header, navigation bar and notice panel
- Indian number and currency formatting (for example, `₹ 1,00,000.00`)
- Clear success and error messages on every form
- Responsive tables with horizontal scrolling for long statements

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, React Router 6 | Single-page UI and client-side routing |
| Build tool | Vite 5 | Fast development server and bundling |
| Backend | Node.js, Express 4 | REST API |
| Database | MongoDB with Mongoose 8 | Data storage and schema modelling |
| Authentication | jsonwebtoken, bcryptjs | Token sessions and password hashing |
| Utilities | cors, dotenv | Cross-origin requests and configuration |

---

## 🏗 System Architecture

```
┌──────────────────────┐        HTTP /api/*         ┌──────────────────────┐        ┌──────────────────┐
│   React Client       │ ─────────────────────────▶ │   Express Server     │ ─────▶ │     MongoDB      │
│   (Vite, port 5173)  │ ◀───────────────────────── │   (Node, port 5000)  │ ◀───── │  (port 27017)    │
│                      │       JSON + JWT           │                      │        │                  │
└──────────────────────┘                            └──────────────────────┘        └──────────────────┘
   • Pages and routing                                 • Auth and validation           • users
   • Token in localStorage                             • Business logic                • accounts
   • Vite proxy for /api                               • JWT middleware                • transactions
                                                                                       • beneficiaries
```

**Request flow**

1. The user logs in and the server returns a signed JWT.
2. The client stores the token in `localStorage`.
3. Every API call sends the header `Authorization: Bearer <token>`.
4. The auth middleware verifies the token and attaches the user ID to the request.
5. The route handler reads or updates MongoDB and returns JSON.

During development, Vite **proxies** all `/api` requests to `http://localhost:5000`, so no CORS configuration is needed in the browser.

---

## 📁 Project Structure

```
finova-bank/
├── package.json                 # Root helper scripts
├── README.md                    # Project documentation
├── .gitignore                   # Excludes node_modules, .env and dist
│
├── server/                      # ── Backend (Express + MongoDB) ──
│   ├── package.json
│   ├── .env                     # Local configuration (not committed)
│   ├── .env.example             # Template for environment variables
│   └── src/
│       ├── server.js            # App entry: middleware, routes, DB connection
│       ├── middleware/
│       │   └── auth.js          # JWT verification guard
│       ├── models/
│       │   └── index.js         # User, Account, Transaction, Beneficiary schemas
│       └── routes/
│           ├── auth.js          # Register, login and profile endpoints
│           └── bank.js          # Account, statement, cash and transfer endpoints
│
└── client/                      # ── Frontend (React + Vite) ──
    ├── package.json
    ├── index.html               # HTML shell
    ├── vite.config.js           # Dev server port and /api proxy
    └── src/
        ├── main.jsx             # React entry with BrowserRouter
        ├── App.jsx              # Pages, layout and protected routing
        ├── api.js               # Fetch wrapper, currency and date formatters
        └── styles.css           # Net-banking theme
```

---

## ✅ Prerequisites

Install the following before you begin:

| Requirement | Version | How to verify |
|---|---|---|
| **Node.js** | 18 or newer | `node -v` |
| **npm** | Bundled with Node.js | `npm -v` |
| **MongoDB** | Community Server 6+ (local) or a MongoDB Atlas cluster | `mongod --version` |
| **Git** *(optional)* | Any recent version | `git --version` |

---

## ⚙ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/kondapallisashank2007-tech/Bank_Management_System.git
cd Bank_Management_System
```

*(If you downloaded a ZIP instead, extract it and open the extracted folder.)*

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create `server/.env` by copying the template:

```bash
# from inside the server folder
cp .env.example .env          # macOS / Linux
copy .env.example .env        # Windows (Command Prompt)
```

Then open `server/.env` and set your own values (see the next section).

---

## 🔑 Environment Variables

All configuration lives in **`server/.env`**.

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PORT` | No | `5000` | Port on which the API listens |
| `MONGO_URI` | **Yes** | – | MongoDB connection string |
| `JWT_SECRET` | **Yes** | – | Secret key used to sign and verify tokens |

**Example for a local MongoDB**

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/FinovaBank
JWT_SECRET=replace_with_a_long_random_string
```

**Example for MongoDB Atlas**

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/FinovaBank
```

> ⚠️ Never commit `.env` to GitHub. Use a long, random value for `JWT_SECRET`. You can generate one with:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

The server refuses to start if `MONGO_URI` or `JWT_SECRET` is missing.

---

## ▶ Running the Application

Make sure **MongoDB is running**, then start the two servers in **separate terminals**.

**Terminal 1 – Backend**

```bash
cd server
npm run dev          # auto-restarts on file changes
# or: npm start      # plain start
```

Expected output:

```
API running on http://localhost:5000
```

**Terminal 2 – Frontend**

```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

### Available scripts

| Location | Command | Description |
|---|---|---|
| `server/` | `npm start` | Start the API |
| `server/` | `npm run dev` | Start the API with auto-reload |
| `client/` | `npm run dev` | Start the Vite development server |
| `client/` | `npm run build` | Create a production build in `client/dist` |
| root | `npm run server` | Shortcut to start the API |
| root | `npm run client` | Shortcut to start the client |

---

## 🧭 How to Use the Application

### Step 1 – Register
Open `http://localhost:5173/register`, enter your name, mobile number, email and a password of at least 6 characters. Your savings account is created instantly with ₹1,000.

### Step 2 – Log in
Sign in with your email as the **User ID** and your password. You will land on the **Account Summary** dashboard.

### Step 3 – Explore the menu

| Menu item | What it does |
|---|---|
| **Account Summary** | Shows account number, type, branch, IFSC, balance and the last 5 transactions |
| **Fund Transfer** | Sends money to a saved payee using IMPS, NEFT or RTGS |
| **Payees** | Adds or removes beneficiaries |
| **Account Statement** | Lists up to 200 recent transactions |
| **Deposit / Withdraw** | Adds or removes demo cash from your account |

### Step 4 – Try a money transfer

1. Log out and register a **second user**.
2. Copy the second user's **account number** from their Account Summary.
3. Log in as the first user and open **Payees**.
4. Add the payee using any name and the copied account number.
5. Open **Fund Transfer**, choose the payee, enter an amount and click **Pay Now**.
6. Check **Account Statement** for the debit entry. The second user will see a matching credit.

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

All endpoints except `register` and `login` require this header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint | Body | Success Response |
|---|---|---|---|
| `POST` | `/auth/register` | `name`, `email`, `phone`, `password` | `201` – `{ token, user }` |
| `POST` | `/auth/login` | `email`, `password` | `200` – `{ token, user }` |
| `GET` | `/auth/me` | – | `200` – user profile (without password) |

### Account and Transactions

| Method | Endpoint | Body / Query | Description |
|---|---|---|---|
| `GET` | `/account` | – | Returns the logged-in user's account |
| `GET` | `/transactions` | `?limit=5` (max 200, default 50) | Returns transactions, newest first |
| `POST` | `/deposit` | `amount` | Adds funds and returns the updated account |
| `POST` | `/withdraw` | `amount` | Removes funds if the balance is sufficient |

### Payees

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/beneficiaries` | – | Lists payees sorted by name |
| `POST` | `/beneficiaries` | `name`, `accountNumber` | Adds a payee after verifying the account exists |
| `DELETE` | `/beneficiaries/:id` | – | Removes one of your payees |

### Fund Transfer

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/transfer` | `toAccount`, `amount`, `mode`, `remarks` | Transfers money to another Finova account |

**Sample request**

```json
{
  "toAccount": "41234567890",
  "amount": 250.50,
  "mode": "IMPS",
  "remarks": "Rent share"
}
```

**Sample response**

```json
{
  "message": "Transfer successful",
  "balance": 749.5,
  "ref": "7283940172"
}
```

### Common error responses

| Status | Meaning | Example message |
|---|---|---|
| `400` | Invalid input | `Enter a valid amount` |
| `401` | Missing, invalid or expired token | `Session expired. Please login again.` |
| `409` | Duplicate registration | `User already registered` |
| `500` | Unexpected server error | `Server error` |

---

## 🗄 Database Design

**Database name:** `FinovaBank`

### `users`
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, stored in lowercase |
| `phone` | String | Optional |
| `password` | String | Required, bcrypt hash |
| `createdAt`, `updatedAt` | Date | Automatic timestamps |

### `accounts`
| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId → User | Owner of the account |
| `accountNumber` | String | Unique, 11 digits starting with `4` |
| `type` | String | Defaults to `Savings` |
| `ifsc` | String | Defaults to `FINB0001024` |
| `branch` | String | Defaults to `Hyderabad Main Branch` |
| `balance` | Number | Minimum `0` |

### `transactions`
| Field | Type | Notes |
|---|---|---|
| `account` | ObjectId → Account | Account the entry belongs to |
| `type` | String | `CR` (credit) or `DR` (debit) |
| `amount` | Number | Transaction amount |
| `balanceAfter` | Number | Balance immediately after the entry |
| `mode` | String | `CASH`, `IMPS`, `NEFT` or `RTGS` |
| `remarks` | String | Description or user remarks |
| `counterparty` | String | The other account number in a transfer |

### `beneficiaries`
| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId → User | Owner of the payee list |
| `name` | String | Payee display name |
| `accountNumber` | String | Verified Finova account number |
| `ifsc` | String | Copied from the target account |

**Relationships**

```
User 1 ──── 1 Account 1 ──── * Transaction
  │
  └──── * Beneficiary
```

---

## 📏 Business Rules and Validations

- **Registration:** name, email and a password of **6 or more characters** are mandatory.
- **Unique users:** an email can be registered only once.
- **Amounts:** must be greater than zero, at most **₹10,00,000 per transaction**, and are rounded to 2 decimal places.
- **Withdrawals and transfers:** rejected with `Insufficient balance` if funds are not enough. The balance check and deduction happen in one database operation.
- **Payees:** the account number must exist in Finova Bank, and you cannot add your own account.
- **Transfers:** you cannot transfer to your own account, and every transfer writes a debit entry for the sender and a credit entry for the receiver.
- **Statements:** transaction lists are always sorted from newest to oldest.

---

## 🛡 Security Implementation

| Area | Measure |
|---|---|
| Password storage | `bcryptjs` with 10 salt rounds |
| Sessions | Signed JWT with a 2-hour expiry |
| Route protection | Middleware verifies the token on all banking endpoints |
| Client guard | Protected routes redirect unauthenticated users to `/login` |
| Data isolation | Every query is filtered by the authenticated user's ID |
| Secrets | `.env` is excluded from version control through `.gitignore` |
| Error messages | Login returns one generic message for wrong email or password |
| Atomic balance updates | MongoDB `$inc` with a balance condition prevents overdrawing |

---

## 🧰 Troubleshooting

| Problem | Likely cause | Solution |
|---|---|---|
| `MongoDB connection failed` | MongoDB is not running or `MONGO_URI` is wrong | Start MongoDB and verify `server/.env` |
| `Set MONGO_URI and JWT_SECRET in server/.env` | `.env` file is missing | Copy `.env.example` to `.env` |
| `EADDRINUSE: port 5000` | Another program is using the port | Close it or change `PORT` in `.env` |
| Login succeeds but returns to the login page | Old client code with stale route protection | Use the latest `App.jsx` with the `Protected` component |
| Blank page or `Failed to fetch` | Backend is not running | Start the server in the first terminal |
| `Session expired` message | Token older than 2 hours | Log in again |
| `npm install` errors | Old Node.js version | Upgrade to Node.js 18 or newer |

---

## ⚠ Known Limitations

This project is intentionally simple. Before any real-world use, the following would need attention:

- Transfers update two accounts without a **MongoDB multi-document transaction**, so a crash between steps could leave data inconsistent.
- No rate limiting or account lockout on repeated failed logins.
- The JWT is kept in `localStorage`, which is exposed to XSS attacks; an HttpOnly cookie is safer.
- No email or OTP verification, and no transaction PIN.
- No automated tests.
- The `/transactions` endpoint returns a plain list without pagination controls.

---

## 🚀 Future Enhancements

- [ ] MongoDB transactions for fully atomic transfers
- [ ] OTP or PIN confirmation before payments
- [ ] Downloadable PDF and CSV statements
- [ ] Date-range filters and search in statements
- [ ] Multiple account types (Current, Fixed Deposit, Recurring Deposit)
- [ ] Profile page with password change
- [ ] Rate limiting and security headers with `helmet`
- [ ] Unit and integration tests with Jest and Supertest
- [ ] Docker Compose setup for one-command start
- [ ] Deployment guide for Render, Vercel and MongoDB Atlas

---

## 📜 Disclaimer

Finova Bank is an **educational demonstration project**. It is not a real financial institution, does not handle real money, and must not be used to store genuine banking or personal data.

---

<div align="center">

**Built with ❤️ using the MERN stack**

👤 **Author:** [kondapallisashank2007-tech](https://github.com/kondapallisashank2007-tech)

⭐ If you found this project useful, consider giving the repository a star!

</div>

