# SmartLife - Always Online Deployment

Your app is ready to deploy to free, always-on cloud hosting. Follow these steps:

## 📦 Files Ready in Workspace

- `/home/openclaw/.openclaw/workspace/smartlife-frontend/` - Frontend (React, built & ready)
- `/home/openclaw/.openclaw/workspace/smartlife-backend/` - Backend (Node.js/Express, source code created)

---

## Step 1: Deploy Backend to Render (5 minutes)

**Render is free and always-on** (no more sleep mode as of 2024)

1. Go to https://render.com and sign up (free)

2. Click **"New +"** → **"Web Service"**

3. Choose **"Deploy from directory"** and upload the folder:
   ```
   /home/openclaw/.openclaw/workspace/smartlife-backend/
   ```
   (Zip it first if needed: `cd workspace && zip -r backend.zip smartlife-backend/`)

4. Configure:
   - **Name**: `smartlife-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your-random-secret-string-here` (use any long random string)
   - `FRONTEND_URL` = `*` (or your Netlify URL after step 2)

6. Click **"Create Web Service"**

7. Wait 2-3 minutes for deployment. Copy your URL, e.g.:
   ```
   https://smartlife-backend-xxxx.onrender.com
   ```

---

## Step 2: Deploy Frontend to Netlify (2 minutes)

**Netlify is free, always-on, and includes HTTPS**

1. Go to https://app.netlify.com/drop

2. Drag and drop this folder:
   ```
   /home/openclaw/.openclaw/workspace/smartlife-frontend/dist/
   ```

3. Wait for upload. Copy your URL, e.g.:
   ```
   https://smartlife-xxxx.netlify.app
   ```

4. (Optional) Update the API URL:
   - In Netlify dashboard → Site settings → Build & deploy → Environment
   - Add: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
   - Redeploy if needed

---

## Step 3: Test Your Always-Online App

1. Open your Netlify frontend URL
2. Login with demo credentials:
   - **Email**: `demo@smartlife.com`
   - **Password**: `demo123`
3. Test device controls, scenes, and real-time updates

---

## ✅ What You Get

- **24/7 Uptime**: Both services run continuously
- **Free Hosting**: No credit card required
- **HTTPS**: Automatic SSL certificates
- **Real-time Updates**: Socket.IO works across the internet
- **Scalable**: Upgrade anytime if needed

---

## 🔧 Quick Commands

```bash
# Zip backend for upload
cd /home/openclaw/.openclaw/workspace
zip -r backend.zip smartlife-backend/

# Frontend is already built in smartlife-frontend/dist/
```

---

## 📊 Service Limits (Free Tier)

| Service | Bandwidth | Storage | Notes |
|---------|-----------|---------|-------|
| Render  | 100 GB/mo | 512 MB  | Always-on, no sleep |
| Netlify | 100 GB/mo | 100 MB  | Always-on, instant deploy |

---

## 🆘 Troubleshooting

**Backend won't start on Render:**
- Check logs in Render dashboard
- Verify `package.json` and `server.js` are in the uploaded folder
- Ensure environment variables are set

**Frontend can't connect to backend:**
- Check browser console for CORS errors
- Verify `FRONTEND_URL` in Render matches your Netlify URL
- Test backend directly: `https://your-backend.onrender.com/health`

**Login fails:**
- Backend must be running first
- Check JWT_SECRET is set in Render

---

**Your SmartLife app will be online 24/7, accessible from anywhere! 🎉**
