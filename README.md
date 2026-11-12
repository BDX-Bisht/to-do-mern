# To-Do List App (MERN Stack)

A mobile-first To-Do List web application built with **MongoDB, Express.js, React, Node.js, and Tailwind CSS** based on the SDE-1 MERN Stack Assignment & Figma UI design.

## Features
- **Onboarding & Mobile-First UI**: Clean responsive interface matching the 4 Figma screens (Onboarding, Home, Search, Add/Edit Task bottom sheet).
- **Task Management**:
  - Create tasks with **Title** (required), **Description** (optional), **Date & Time** (required, with optional End Time), and **Priority** (`Low`, `Medium`, `High` — optional).
  - Edit any task attribute and toggle completion status (`In Progress` ↔ `Completed`).
  - Delete tasks via **swipe-left** gesture on mobile/touch or via the delete action button.
- **Monday–Sunday Weekly Organization**:
  - Interactive Monday–Sunday calendar strip with week navigation.
  - Live weekly summary cards (**Task Complete** & **Task Pending**) and **Weekly Progress** bar.
  - **Weekly Overview** (`View All`) displaying expandable Monday–Sunday week cards with open vs. completed counts.
- **Keyword Search**: Live search across task titles and descriptions with options to view, edit, toggle status, or delete results.

---

## Project Structure
```text
├── client/          # React + Vite + Tailwind CSS frontend
├── server/          # Node.js + Express + Mongoose REST API
└── README.md
```

---

## Local Setup

### 1. Backend (`server/`)
```bash
cd server
npm install
cp .env.example .env
# Update MONGODB_URI in server/.env with your MongoDB connection string
npm run dev
```
The API runs on `http://localhost:5000`.

### 2. Frontend (`client/`)
```bash
cd client
npm install
npm run dev
```
The frontend runs on `http://localhost:5173` and proxies `/api/*` requests to `http://localhost:5000`.

---

## REST API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks/weeks?tzOffset=...` | Tasks grouped by Monday–Sunday weeks with open/completed counts |
| `GET` | `/api/tasks?weekStart=YYYY-MM-DD` | Filter tasks by week, date, status, priority, or keyword |
| `GET` | `/api/tasks/search?q=keyword` | Case-insensitive keyword search on title and description |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task fields or toggle status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## Deployment Guide
1. **Backend (Render / Railway)**:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables: `MONGODB_URI`, `CLIENT_ORIGIN` (your Netlify URL), `PORT`
2. **Frontend (Netlify)**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - Environment variable: `VITE_API_URL` = your deployed backend URL (e.g. `https://your-api.onrender.com`)

