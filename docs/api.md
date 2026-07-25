# FixTown API Reference

Base URL: `http://localhost:3001/api`

All protected endpoints require: `Authorization: Bearer <jwt_token>`

---

## Auth

### POST `/auth/register`
Register a new user.
```json
{ "name": "Jane", "email": "jane@example.com", "password": "secret123", "role": "citizen" }
```
Returns: `{ token, user }`

### POST `/auth/login`
```json
{ "email": "jane@example.com", "password": "secret123" }
```
Returns: `{ token, user }`

### GET `/auth/me` 🔒
Returns current user: `{ user }`

---

## Issues

### GET `/issues`
Query params: `category`, `status`, `lat`, `lng`, `radius` (meters), `sort` (votes|recent), `limit`
Returns: `{ issues, total }`

### GET `/issues/:id`
Returns: `{ issue, status_logs, user_voted }`

### POST `/issues` 🔒
Multipart form: `title`, `description`, `category`, `lat`, `lng`, `address`, `image` (file)
Returns: `{ issue }`

### PATCH `/issues/:id/status` 🔒 Officer only
```json
{ "status": "in_progress", "note": "Team dispatched" }
```
Returns: `{ issue }`

### DELETE `/issues/:id` 🔒 Owner or Officer
Returns: `{ message }`

---

## Votes

### POST `/issues/:id/vote` 🔒
Adds a vote. Returns: `{ vote_count }`

### DELETE `/issues/:id/vote` 🔒
Removes vote. Returns: `{ vote_count }`

---

## Notifications

### GET `/notifications?limit=20` 🔒
Returns: `{ notifications, unread }`

### PATCH `/notifications/:id/read` 🔒
Marks one notification read.

### PATCH `/notifications/read-all` 🔒
Marks all notifications read.

---

## Dashboard

### GET `/dashboard/my-issues` 🔒 Citizen
Returns citizen's own issues: `{ issues }`

### GET `/dashboard/analytics` 🔒 Officer
Returns: `{ total, open, in_progress, resolved, rejected, resolved_this_month, avg_days, by_category, last_7_days, top_voted }`

### GET `/dashboard/public-stats`
Public stats for home page: `{ total, resolved, citizens, avg_days }`

---

## Status values
`open` | `in_progress` | `resolved` | `rejected`

## Category values
`pothole` | `manhole` | `water` | `electricity` | `road` | `other`