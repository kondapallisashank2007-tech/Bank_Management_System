# Finova Bank (MERN) - net-banking style UI
1. MongoDB must be running. Edit `server/.env` (MONGO_URI, JWT_SECRET).
2. Terminal 1: `cd server && npm install && npm start`   -> http://localhost:5000
3. Terminal 2: `cd client && npm install && npm run dev` -> http://localhost:5173
4. Open http://localhost:5173/register, create a user (gets a Savings account with Rs 1000).
   Register a second user, then add that account number as a payee to test transfers.
Collections used: users, accounts, transactions, beneficiaries.
