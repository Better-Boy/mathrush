# 🧮 MathRush

**MathRush** is a fast-paced multiplayer web game designed to help kids practice their math skills in a fun, competitive environment. Built with cutting-edge modern web technologies, it blends real-time gameplay with smart feedback powered by AI.

---

## 🛠 Tech Stack

| Technology     | Purpose                                       |
|----------------|-----------------------------------------------|
| 🧠 OpenAI       | Smart feedback and question generation         |
| 📦 Convex       | Real-time database, storage & backend logic   |
| 🧩 Convex Auth  | Seamless authentication                       |
| ⚛️ React (Vite) | Lightning-fast frontend                       |
| 🧪 ShadCN UI    | Elegant, accessible component library         |

---

## Features

### 🚀 Gameplay
- **Solve math problems in real time**, powered by AI-generated content  
- **Unlimited multiplayer matches**, with no cap on participants  
- **Instant scoring**, showing each player’s score as the game progresses  
- **Real-time leaderboards**, updating live throughout the game


### 📩 Resend Email Features
- **Game invitations** sent directly by the game host  
- **Invite tracking** through Resend webhooks  
- **Game results** including leaderboard highlights  
- **Daily Math Challenge** delivered to subscribed users  
- **Weekly digest emails** featuring top news and a summary of a random math concept

### ⚡ **Convex Features**
- **Real time scoring** scores updated instantly after answering a question
- **Synchronized Timer** synchronized timer between different users in the same game
- **Convex Auth** convex auth for security
- **Cron Jobs** for weekly and daily emails
- **Scheduled Queries** for sending game result after completion of game

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/mathrush.git
cd mathrush
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a .env.local file in the root directory:

```
VITE_CONVEX_URL=your-convex-deployment-url
VITE_OPENAI_API_KEY=your-openai-key
```

Add the following keys to convex project environment variables:
1. RESEND_WEBHOOK_SECRET
2. RESEND_API_KEY
3. OPENAI_API_KEY

🛡️ Keep your API keys secure and never commit them to Git!

### 4. Run the development server

```
npx convex dev
npm run dev
```

The app will be available at http://localhost:5173


## 🧮 How It Works

Each player logs in using Convex Auth.

A game session is started, and OpenAI dynamically generates math problems based on difficulty settings.

Convex keeps all game state in sync between players in real-time.

Players compete to solve problems fastest — scores update live!

Beautiful, responsive UI made possible by ShadCN components.

## 🤝 Contributing

PRs and issues are welcome! Please open an issue to discuss features or bugs.

## Roadmap

- Game history & stats
- Adaptive AI difficulty

