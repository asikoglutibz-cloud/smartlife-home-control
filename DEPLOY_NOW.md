# 🚀 SmartLife Home Control - One-Click Deploy

Your code is live on GitHub: **https://github.com/asikoglutibz-cloud/smartlife-home-control**

---

## ✅ Step 1: Deploy Backend to Render (2 clicks)

**Click this link to auto-deploy:**

https://render.com/deploy?repo=https://github.com/asikoglutibz-cloud/smartlife-home-control

1. Click the link above
2. Login with: `asikoglu.tibz@gmail.com` / `Nt#uNENDsf8ac6X`
3. The `render.yaml` will auto-configure everything
4. Add environment variable: `JWT_SECRET` = any random string (e.g., `my-super-secret-key-12345`)
5. Click **Create Web Service**
6. Wait 2-3 minutes, then copy your URL (e.g., `https://smartlife-backend.onrender.com`)

---

## ✅ Step 2: Deploy Frontend to Netlify (2 clicks)

**Click this link to auto-deploy:**

https://app.netlify.com/start/deploy?repository=https://github.com/asikoglutibz-cloud/smartlife-home-control&base=frontend&publish_dir=frontend/dist

1. Click the link above
2. Login/Signup (use GitHub for fastest setup)
3. Netlify will auto-detect the frontend config
4. Click **Deploy site**
5. Wait 1-2 minutes, then copy your URL (e.g., `https://smartlife-home-control.netlify.app`)

---

## ✅ Step 3: Connect Frontend to Backend

After both are deployed:

1. In Netlify dashboard → Site settings → Environment variables
2. Add: `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
3. Redeploy (Deploys → Trigger deploy)

---

## 🧪 Test Your App

1. Open your Netlify URL
2. Login: `demo@smartlife.com` / `demo123`
3. Control devices, activate scenes, monitor energy!

---

## 📊 Your Services Are Now:
- ✅ **Always Online** (24/7, independent of your computer)
- ✅ **Free Hosting** (Render + Netlify free tiers)
- ✅ **Auto-HTTPS** (SSL certificates included)
- ✅ **Real-time Updates** (Socket.IO works globally)

---

**Need help?** Check the logs in Render/Netlify dashboards if anything fails.
