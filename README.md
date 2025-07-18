💸 PayTM‑Clone

A mini full-stack payment application inspired by PayTM, built with the MERN stack. Users can transfer money between accounts, view transaction history, and manage balances. The project is in progress, with core features already implemented.

🧠 Features

🔐 User Authentication: Secure registration and login using JWT and password hashing.

💸 User-to-User Transactions: Transfer funds between accounts.

📉 Balance Management: Real-time updates for sender and receiver balances.

🧾 Transaction History: List of past transactions with timestamp and details.

💻 Responsive Dashboard: Clean user interface for transaction and history management.

🛠️ Tech Stack

Frontend: React.js, React Router, Axios

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Authentication: JSON Web Tokens (JWT) (if implemented)

Styling: CSS / TailwindCSS (optional)

🚀 Getting Started

Back-End (Server)

Navigate to server/:

cd paytm-clone/server

npm install

Create .env with:

MONGO_URI=your_mongo_connection_string

JWT_SECRET=your_jwt_secret (if using auth)

Run the server:

npm start

It will be accessible at http://localhost:5000/

