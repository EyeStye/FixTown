# 🏙️ FixTown — Local Community Problem Reporting Platform

> A civic-tech platform where citizens report infrastructure issues (potholes, manholes, utilities) and municipalities track, prioritize, and resolve them.

---

## 🗂️ Project Architecture

```
fixtown/
├── frontend/                    # React + Vite SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Icons, images, fonts
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   │   ├── map/             # Leaflet map components
│   │   │   ├── issues/          # Issue card, list, form
│   │   │   ├── notifications/   # Notification bell, panel
│   │   │   └── ui/              # Buttons, modals, badges
│   │   ├── pages/               # Route-level page components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── MapView.jsx      # Interactive map of issues
│   │   │   ├── ReportIssue.jsx  # Submit new issue
│   │   │   ├── IssueDetail.jsx  # Single issue page
│   │   │   ├── Dashboard.jsx    # Citizen personal dashboard
│   │   │   ├── MunicipalDash.jsx# Officer analytics dashboard
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/             # React context (auth, notifications)
│   │   ├── hooks/               # Custom hooks (useAuth, useIssues, useMap)
│   │   ├── utils/               # API client, formatters, validators
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express REST API
│   ├── config/
│   │   ├── db.js                # PostgreSQL + PostGIS connection
│   │   └── cloudinary.js        # Cloudinary config
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   ├── roles.js             # Role-based access (citizen/officer)
│   │   └── upload.js            # Multer + Cloudinary upload
│   ├── models/                  # SQL query helpers (no ORM)
│   │   ├── User.js
│   │   ├── Issue.js
│   │   ├── Vote.js
│   │   ├── Notification.js
│   │   └── StatusLog.js
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register, /login
│   │   ├── issues.js            # CRUD + geospatial queries
│   │   ├── votes.js             # POST/DELETE /api/issues/:id/vote
│   │   ├── notifications.js     # GET, PATCH (mark read)
│   │   └── dashboard.js         # Analytics endpoints
│   ├── controllers/             # Route handler logic
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── docs/                        # Additional documentation
│   ├── api.md                   # API endpoint reference
│   └── deployment.md            # Deployment guide
│
├── README.md                    # This file
└── progress.md                  # Step-by-step build log
```

---

## 🗄️ Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(100) | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | TEXT | bcrypt |
| role | ENUM('citizen','officer') | Default: citizen |
| created_at | TIMESTAMPTZ | |

### `issues`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| title | VARCHAR(200) | |
| description | TEXT | |
| category | ENUM | pothole, manhole, water, electricity, road, other |
| status | ENUM | open, in_progress, resolved, rejected |
| location | GEOGRAPHY(POINT,4326) | PostGIS geo point |
| address | TEXT | Reverse-geocoded address |
| image_url | TEXT | Cloudinary URL |
| user_id | UUID FK → users | Reporter |
| vote_count | INT | Denormalized for perf |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `votes`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users | |
| issue_id | UUID FK → issues | |
| created_at | TIMESTAMPTZ | |
| UNIQUE(user_id, issue_id) | | One vote per user |

### `notifications`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users | |
| issue_id | UUID FK → issues | |
| message | TEXT | |
| is_read | BOOLEAN | Default: false |
| created_at | TIMESTAMPTZ | |

### `status_logs`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| issue_id | UUID FK → issues | |
| old_status | TEXT | |
| new_status | TEXT | |
| changed_by | UUID FK → users | Officer ID |
| created_at | TIMESTAMPTZ | |

---

## 🔌 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast, modern, great DX |
| Backend | Node.js + Express | Familiar, performant |
| Database | PostgreSQL + PostGIS | Best-in-class geospatial queries |
| Auth | JWT + bcrypt | Citizen & Municipal Officer roles |
| Maps | Leaflet.js + OpenStreetMap | Free, no API key needed |
| Image Upload | Cloudinary | Free tier, auto-compression, CDN |
| Notifications | In-app (DB polling) | WebSocket-upgradeable |
| Deployment | Vercel + Railway | Free tiers, easy CI/CD |

---

## 👥 User Roles

### Citizen
- Register/Login
- Report issue with geo-tag, photo, description
- Browse map, upvote issues
- Personal dashboard with issue history
- In-app notifications on status change

### Municipal Officer
- Login with officer credentials
- View all issues on map sorted by votes/priority
- Filter by category, area, status
- Update issue status → triggers citizen notification
- Analytics: resolution stats, hotspot zones, avg time

---

## 🚀 Getting Started

```bash
# Clone and install
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Fill in DB_URL, JWT_SECRET, CLOUDINARY_* keys

# Run dev servers
cd frontend && npm run dev        # http://localhost:5173
cd backend && npm run dev         # http://localhost:3001
```

---

## 🌐 Deployment

- **Frontend**: Vercel — connect GitHub repo, auto-deploy on push
- **Backend + DB**: Railway — PostgreSQL with PostGIS extension, Node service

---

*Built with ❤️ for civic tech — FixTown helps communities hold municipalities accountable.*
