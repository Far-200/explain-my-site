# 🔍 ExplainMyWebsite

> AI-powered website analyzer. Paste any URL → get an instant breakdown of what it does, how it's built, the UX quality, and security observations.

![ExplainMyWebsite Screenshot](https://placeholder.com/screenshot.png)

---

## ✨ Features

| Feature                  | Description                                |
| ------------------------ | ------------------------------------------ |
| 🧠 AI Summary            | What the website does, in plain English    |
| ⚙️ Tech Stack Guess      | Framework, hosting, analytics detection    |
| 🎨 UI/UX Feedback        | Design quality assessment with suggestions |
| 🔐 Security Observations | Surface-level security flags               |
| 📋 Copy Report           | Copy full analysis to clipboard            |
| 📥 Download PDF          | Export a branded PDF report                |
| 🕐 History               | Last 10 analyses saved locally             |
| ✅ URL Validation        | Smart URL normalization + error handling   |

---

## 🏗️ Project Structure

```
explain-my-website/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── AnimatedBackground.jsx   # Floating orb decorations
│       │   ├── Header.jsx               # Top navigation bar
│       │   ├── URLInput.jsx             # Hero input section
│       │   ├── SkeletonLoader.jsx       # Animated loading state
│       │   ├── ResultCard.jsx           # Individual analysis card
│       │   ├── AnalysisResults.jsx      # Full results layout
│       │   ├── ErrorDisplay.jsx         # Error state UI
│       │   ├── HistoryPanel.jsx         # Slide-in history sidebar
│       │   └── Footer.jsx               # Page footer
│       ├── pages/
│       │   └── HomePage.jsx             # Main page, wires everything
│       ├── services/
│       │   └── analyzeService.js        # API calls to backend
│       ├── hooks/
│       │   ├── useAnalysis.js           # Analysis state machine
│       │   └── useClipboard.js          # Clipboard copy hook
│       └── utils/
│           ├── urlUtils.js              # URL validation & parsing
│           ├── historyUtils.js          # localStorage history
│           └── pdfExport.js             # jsPDF report generation
│
└── server/                     # Node.js + Express backend
    ├── routes/
    │   └── analyze.js           # POST /analyze, GET /health
    ├── middleware/
    │   └── validateURL.js       # URL validation middleware
    ├── services/
    │   ├── fetcher.js            # Axios + Cheerio scraper
    │   ├── promptBuilder.js      # AI system + user prompts
    │   └── aiService.js          # OpenAI / Anthropic / Mock
    └── index.js                  # Express server entry point
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **npm** v9 or later (comes with Node)
- An **API key** (optional — app works in mock mode without one)

---

### Step 1 — Clone / Download

```bash
# If using git:
git clone https://github.com/yourusername/explain-my-website.git
cd explain-my-website

# Or just unzip the project and open a terminal in the folder
```

---

### Step 2 — Set Up the Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Open `server/.env` in any text editor. The default settings use **mock mode** — no API key needed:

```env
PORT=3001
AI_PROVIDER=mock        # Change to "openai" or "anthropic" for real AI
OPENAI_API_KEY=         # Only needed if AI_PROVIDER=openai
ANTHROPIC_API_KEY=      # Only needed if AI_PROVIDER=anthropic
CLIENT_ORIGIN=http://localhost:5173
FETCH_TIMEOUT=10000
```

Start the server:

```bash
# Production start
npm start

# Development (auto-restarts on file changes, Node 18+)
npm run dev
```

You should see:

```
  🚀 Server running at http://localhost:3001
  🤖 AI Provider: mock
```

---

### Step 3 — Set Up the Frontend

Open a **new terminal window**:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

You should see:

```
  VITE v5.x  ready in 500ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 4 — Open the App

Visit **http://localhost:5173** in your browser. 🎉

---

## 🔑 Using Real AI (Optional)

By default, the app uses **mock responses** — realistic fake data generated locally, no API key needed. Perfect for development.

### Enable OpenAI (GPT-4o-mini)

1. Get an API key at [platform.openai.com](https://platform.openai.com/api-keys) or any other platform of your choice.
2. Create `server/.env`:
   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the server

**Cost:** GPT-4o-mini is very cheap — roughly $0.001–0.003 per analysis.

### Enable Anthropic (Claude Haiku)

1. Get an API key at [console.anthropic.com](https://console.anthropic.com/)
2. Edit `server/.env`:
   ```env
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. Restart the server

---

## 🌐 API Reference

### POST `/analyze`

Analyzes a website URL.

**Request:**

```json
{
  "url": "https://stripe.com"
}
```

**Response:**

```json
{
  "summary": "Stripe is a financial infrastructure platform...",
  "techStack": "React-based frontend, likely Next.js...",
  "uiUx": "Excellent visual design with clear hierarchy...",
  "security": "HTTPS enforced. Multiple third-party scripts..."
}
```

**Error Response:**

```json
{
  "error": "Unable to reach the website. Is the URL correct?"
}
```

### GET `/health`

Returns server status.

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "provider": "mock",
  "uptime": "120s"
}
```

---

## 🧱 Tech Stack

### Frontend

| Library          | Purpose                 |
| ---------------- | ----------------------- |
| React 18         | UI framework            |
| Vite 5           | Build tool + dev server |
| Tailwind CSS 3   | Utility-first styling   |
| Framer Motion 11 | Animations              |
| Axios            | HTTP requests           |
| jsPDF            | PDF export              |

### Backend

| Library            | Purpose                           |
| ------------------ | --------------------------------- |
| Express 4          | HTTP server                       |
| Axios              | Fetch website HTML                |
| Cheerio            | HTML parsing (server-side jQuery) |
| OpenAI SDK         | GPT-4 integration                 |
| express-rate-limit | Rate limiting                     |
| dotenv             | Environment variables             |

---

## 🎨 Design System

- **Colors:** Deep void black `#050508`, purple accent `#7c6aff`, pink `#ff6a9e`, teal `#6affda`
- **Fonts:** Syne (display), DM Sans (body), JetBrains Mono (code/monospace)
- **Style:** Glassmorphism cards, gradient mesh background, animated orbs
- **Motion:** Framer Motion for all enter/exit transitions

---

## 🔒 Security Notes

- URL validation blocks localhost, private IPs, and malformed URLs
- Rate limiting: 30 requests/15min per IP
- No user data is stored on the server
- Analysis history is stored client-side in localStorage only
- The AI analysis is informational only — not a security audit

---

## 🚧 Troubleshooting

| Problem                             | Solution                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `Cannot connect to analysis server` | Make sure `cd server && npm run dev` is running                               |
| `Unable to reach the website`       | The target site may block bots. Try another URL.                              |
| `Request timed out`                 | Increase `FETCH_TIMEOUT` in `.env`                                            |
| `AI returned empty response`        | Check your API key in `.env` and ensure you have credits                      |
| Port 3001 already in use            | Change `PORT=3002` in `server/.env` and update Vite proxy in `vite.config.js` |
| Blank page on frontend              | Check browser console for errors, ensure Tailwind CSS built correctly         |

---

## 📁 Environment Variables Reference

### `server/.env`

| Variable            | Default                 | Description                      |
| ------------------- | ----------------------- | -------------------------------- |
| `PORT`              | `3001`                  | Express server port              |
| `AI_PROVIDER`       | `mock`                  | `mock`, `openai`, or `anthropic` |
| `OPENAI_API_KEY`    | —                       | OpenAI API key                   |
| `ANTHROPIC_API_KEY` | —                       | Anthropic API key                |
| `CLIENT_ORIGIN`     | `http://localhost:5173` | Frontend URL for CORS            |
| `FETCH_TIMEOUT`     | `10000`                 | Website fetch timeout (ms)       |

---

## 📜 License

MIT — free to use, modify, and distribute.

---

Built with ❤️ using React, Node.js, and Claude AI.
