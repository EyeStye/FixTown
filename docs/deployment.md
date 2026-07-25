# FixTown — Deployment Guide

## Recommended Stack (Fully Free, No Expiry)

| Layer      | Service          | Notes                          |
|------------|------------------|--------------------------------|
| Frontend   | Vercel           | Free forever                   |
| Backend    | Render + UptimeRobot | Free, kept always-on      |
| Database   | Supabase         | Free PostgreSQL + PostGIS      |
| Images     | Cloudinary       | Free 25 credits/month          |

---

## 1. Database — Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → copy the **Connection String** (URI format)
3. Open **SQL Editor** → paste and run the full contents of `backend/migrations/001_init.sql`
   - PostGIS is already enabled on Supabase — no need to install it
4. Your `DATABASE_URL` is the connection string from step 2

---

## 2. Backend — Render

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add environment variables:
```
NODE_ENV=production
DATABASE_URL=<connection string from Supabase>
JWT_SECRET=<strong random string — min 32 chars>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<your cloudinary>
CLOUDINARY_API_KEY=<your cloudinary>
CLOUDINARY_API_SECRET=<your cloudinary>
CLIENT_URL=https://your-app.vercel.app
PORT=3001
```
7. Deploy → copy your Render URL (e.g. `https://fixtown-api.onrender.com`)

### Keep Render Always On — UptimeRobot

Render free tier sleeps after 15min of inactivity (first request takes ~60s to wake).
Fix: use UptimeRobot to ping it every 14 minutes — completely free.

1. Go to [uptimerobot.com](https://uptimerobot.com) → Sign up free
2. Add New Monitor:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `FixTown API`
   - URL: `https://fixtown-api.onrender.com/api/health`
   - Monitoring Interval: **5 minutes**
3. Save — UptimeRobot will ping your API regularly, keeping it awake 24/7

---

## 3. Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import GitHub repo
2. Set **Root Directory** to `frontend`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `dist`
5. Add environment variable:
```
VITE_API_URL=https://fixtown-api.onrender.com
```
6. Update `frontend/src/utils/api.js`:
```js
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
})
```
7. Update `frontend/vite.config.js` — remove the `proxy` block (not needed in production):
```js
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
```
8. Deploy → get your Vercel URL

---

## 4. Update CORS

In Render backend environment variables, update:
```
CLIENT_URL=https://your-actual-vercel-url.vercel.app
```
Redeploy the backend after this change.

---

## 5. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free
2. Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. Add to Render environment variables

---

## 6. Verify Deployment

```bash
# Health check
curl https://fixtown-api.onrender.com/api/health

# Public stats
curl https://fixtown-api.onrender.com/api/dashboard/public-stats
```

Visit your Vercel URL → register → report issue → verify the full flow works.

---

## Alternative Backend Options (Always On, No Sleep)

If you don't want to use UptimeRobot:

| Service | Notes |
|---------|-------|
| [Koyeb](https://koyeb.com) | Never sleeps, free tier, easy Node.js deploy |
| [Fly.io](https://fly.io)   | Never sleeps, free 3 VMs, needs `fly.toml` config |

For Koyeb:
1. New App → GitHub → root dir: `backend`
2. Port: `3001`, Start: `node server.js`
3. Add same env vars as Render above

---

## Custom Domain (Optional)

- **Vercel**: Settings → Domains → add your domain
- **Render**: Service → Settings → Custom Domain

---

## Summary Checklist

- [ ] Supabase project created + migration run
- [ ] Render web service deployed + env vars set
- [ ] UptimeRobot monitor added (or using Koyeb/Fly.io)
- [ ] Cloudinary account connected
- [ ] Vercel frontend deployed + `VITE_API_URL` set
- [ ] CORS `CLIENT_URL` updated in Render
- [ ] Full flow tested: register → report → vote → notify