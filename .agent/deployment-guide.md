# 🚀 Deployment Guide for Project-ING1-s1

## 📊 Application Architecture

This is a **full-stack MERN application** with two separate components:

```
┌─────────────────────┐          ┌─────────────────────┐
│   Frontend (React)  │  ◄────►  │  Backend (Express)  │
│   Vite + React      │   API    │  Node.js + MongoDB  │
│   (client/)         │  Calls   │  (server/)          │
└─────────────────────┘          └─────────────────────┘
      Deploy on:                       Deploy on:
    Vercel/Netlify                       Render
```

**Important**: You need to deploy **BOTH** parts separately!

---

## ✅ Step 1: Backend Deployment (Already Done!)

### Platform: **Render**
- ✓ **URL**: `https://hirex-ad9w.onrender.com`
- ✓ **Status**: Deployed successfully
- ✓ **Test**: Visit the URL and you should see:
  ```json
  {
    "success": true,
    "message": "Authentication API is running",
    "storage": "MongoDB"
  }
  ```

### Environment Variables on Render:
Make sure these are set in your Render dashboard:
- `MONGO_URI` - Your MongoDB connection string
- `JWT_ACCESS_SECRET` - Secret for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret for JWT refresh tokens
- `CLIENT_URL` - Your frontend URL (update after deploying frontend)
- `N8N_CRITIQUE_WEBHOOK_URL` - Your n8n webhook URL
- `NODE_ENV` - `production`

---

## 🎯 Step 2: Frontend Deployment (To Do)

### Option A: Deploy to **Vercel** (Recommended)

#### 1. **Install Vercel CLI** (optional, or use web interface)
```bash
npm i -g vercel
```

#### 2. **Create `.env` file in client folder**
```bash
cd client
echo "VITE_API_URL=https://hirex-ad9w.onrender.com/api" > .env
```

#### 3. **Deploy via Vercel CLI**
```bash
# From the client directory
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- What's your project's name? **project-ing1-s1-client** (or any name)
- In which directory is your code located? **./** (current directory)
- Want to override settings? **No**

#### 4. **Set Environment Variable on Vercel**
Either via CLI:
```bash
vercel env add VITE_API_URL
# Then paste: https://hirex-ad9w.onrender.com/api
```

Or via Vercel Dashboard:
- Go to your project → Settings → Environment Variables
- Add: `VITE_API_URL` = `https://hirex-ad9w.onrender.com/api`

#### 5. **Deploy to Production**
```bash
vercel --prod
```

---

### Option B: Deploy to **Netlify**

#### 1. **Install Netlify CLI** (optional)
```bash
npm i -g netlify-cli
```

#### 2. **Create `netlify.toml` in client folder**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. **Deploy via Netlify CLI**
```bash
cd client
netlify init
netlify deploy --prod
```

#### 4. **Set Environment Variables**
Via Netlify Dashboard:
- Site settings → Environment variables
- Add: `VITE_API_URL` = `https://hirex-ad9w.onrender.com/api`

---

## 🔧 Step 3: Update Backend CORS

Once your frontend is deployed, **update the backend** to allow requests from your frontend URL:

### On Render Dashboard:
1. Go to your backend service
2. Environment → Add environment variable
3. Add or update:
   - `CLIENT_URL` = `https://your-frontend-app.vercel.app` (your actual frontend URL)

---

## 🧪 Testing Your Deployment

### 1. **Test Backend Only**
```bash
curl https://hirex-ad9w.onrender.com/
```
Should return JSON with "Authentication API is running"

### 2. **Test Frontend**
- Visit your deployed frontend URL
- You should see the actual React application UI
- Try logging in, registering, etc.

### 3. **Test Full Integration**
- Open browser DevTools → Network tab
- Interact with your app
- You should see API calls going to `https://hirex-ad9w.onrender.com/api/...`

---

## 🐛 Common Issues & Solutions

### Issue 1: "CORS Error"
**Solution**: Update `CLIENT_URL` on Render to match your deployed frontend URL exactly (no trailing slash)

### Issue 2: "API calls failing"
**Solution**: Check that `VITE_API_URL` environment variable is set correctly on your frontend hosting

### Issue 3: "Cannot read .env"
**Solution**: For Vite, environment variables must be prefixed with `VITE_` and set in the hosting platform's environment settings

---

## 📝 Quick Deploy Commands

### For Frontend (Vercel):
```bash
cd client
vercel env add VITE_API_URL production
# Paste: https://hirex-ad9w.onrender.com/api
vercel --prod
```

### Update Backend After Frontend Deploy:
On Render dashboard, set:
```
CLIENT_URL=https://your-actual-frontend-url.vercel.app
```

---

## 🎉 Final Checklist

- [ ] Backend deployed on Render (✓ Already done)
- [ ] Frontend deployed on Vercel/Netlify
- [ ] `VITE_API_URL` set on frontend hosting platform
- [ ] `CLIENT_URL` set on Render backend
- [ ] Test login/register functionality
- [ ] Test all API interactions
- [ ] Check browser console for errors

---

## 🔗 Your URLs

- **Backend API**: https://hirex-ad9w.onrender.com
- **Frontend UI**: `[To be deployed]`
- **API Endpoints**: https://hirex-ad9w.onrender.com/api/...

---

## 💡 Development vs Production

### Local Development:
- Frontend: `http://localhost:5173` (talks to `http://localhost:5000`)
- Backend: `http://localhost:5000`

### Production:
- Frontend: `https://your-app.vercel.app` (talks to `https://hirex-ad9w.onrender.com`)
- Backend: `https://hirex-ad9w.onrender.com`

The code automatically uses the correct URL based on environment variables!
