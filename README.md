# InterviewAce

AI-powered mock interview platform with a 3D avatar interviewer. Practice technical interviews, get real-time feedback, and receive detailed performance reviews.

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Frontend   | React 19, Vite, React Three Fiber, Three.js  |
| AI Engine  | Google Gemini 2.5 Flash                      |
| Backend    | Express 5, TypeScript, PostgreSQL, `pg`      |
| Speech     | Web Speech API (STT + TTS)                   |

## Project Structure

```
InterviewAce/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── avatar/        # 3D avatar (Three.js)
│   │   │   ├── review/        # Review panel & modal
│   │   │   └── ui/            # Generic UI (ChatBubble, etc.)
│   │   ├── config/            # App configuration (Gemini setup)
│   │   ├── constants/         # Prompts, roles, topics
│   │   ├── hooks/             # Custom React hooks (speech)
│   │   ├── pages/             # Route-level pages
│   │   ├── services/          # API service layer
│   │   ├── styles/            # Global CSS
│   │   └── utils/             # Utility functions (retry, etc.)
│   └── public/                # Static assets (3D models)
│
├── server/                    # Express backend (TypeScript)
│   └── src/
│       ├── config/            # DB connection
│       ├── controllers/       # Route handlers
│       ├── middleware/         # Error handling, auth
│       ├── models/            # Auth/storage models
│       └── routes/            # API route definitions
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL or Supabase (optional in local dev if you use file fallback)
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/InterviewAce.git
cd InterviewAce

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Environment Setup

```bash
# Client — create .env in client/
cp client/.env.example client/.env
# Edit client/.env and add your Gemini API key

# Server — create .env in server/
cp server/.env.example server/.env
# Edit server/.env and add your PostgreSQL/Supabase connection string
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

If PostgreSQL is not available locally, keep `AUTH_STORAGE_MODE=auto` or set `AUTH_STORAGE_MODE=file` in `server/.env`. In development, auth will then use `server/.data/users.json` instead of failing at startup.

## Features

- 3D animated avatar with lip-sync
- Real-time speech-to-text (microphone input)
- AI-generated interview questions (Gemini 2.5 Flash)
- Per-answer feedback
- Comprehensive end-of-interview performance review
- Score rings for communication, technical, confidence, problem-solving
- 10+ job roles, 5 experience levels, 10 interview topics

## Environment Variables

### Client (`client/.env`)

| Variable            | Description              |
| ------------------- | ------------------------ |
| `VITE_GEMINI_API_KEY` | Google Gemini API key    |
| `VITE_GEMINI_MODEL`   | Model name (default: `gemini-2.5-flash`) |

### Server (`server/.env`)

| Variable            | Description |
| ------------------- | ----------- |
| `PORT`              | Server port (default: `8000`) |
| `DATABASE_URL`      | PostgreSQL or Supabase connection string |
| `AUTH_STORAGE_MODE` | `auto`, `postgres`, or `file` |
| `JWT_SECRET`        | Secret used to sign auth tokens |
| `JWT_EXPIRES_IN`    | Token lifetime (default: `7d`) |
| `NODE_ENV`          | `development` or `production` |

## Troubleshooting

- `Download the React DevTools for a better development experience` is a normal React development-only console message, not a runtime error.
- If `/api/auth/login` returns `500` during local development, make sure the backend is running. This project now falls back to local file-backed auth when PostgreSQL is unavailable, but `AUTH_STORAGE_MODE=postgres` will still require a working database connection.

## License

MIT
