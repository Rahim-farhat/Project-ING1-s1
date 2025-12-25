# 🚀 Single-Service Deployment Guide (Render)

## 📊 Deployment Strategy

You're deploying **both frontend and backend together** in a single Render service. The Express server will:
1. Serve API routes at `/api/*`
2. Serve the built React app for all other routes

```
┌─────────────────────────────────────────┐
│      Render Web Service                 │
│  https://hirex-ad9w.onrender.com        │
│                                         │
│  ┌────────────┐      ┌────────────┐    │
│  │   React    │ ◄──► │  Express   │    │
│  │   (dist)   │      │   Server   │    │
│  │  Frontend  │      │  + MongoDB │    │
│  └────────────┘      └────────────┘    │
│                                         │
│  / → React App                          │
│  /api/* → Backend API                   │
└─────────────────────────────────────────┘
```

---

## ✅ Render Configuration

### **Build Command:**
```bash
cd server && npm install && cd ../client && npm install && npm run build
```

This will:
1. Install server dependencies
2. Install client dependencies
3. Build the React app → creates `client/dist/`

### **Start Command:**
```bash
node server/index.js
```

### **Root Directory:**
Leave **empty** (uses repository root)

---

## 🔧 Environment Variables on Render

Set these in your Render dashboard:

### **Required:**
- `NODE_ENV` = `production` ← **CRITICAL! This enables static file serving**
- `MONGO_URI` = `your_mongodb_connection_string`
- `JWT_ACCESS_SECRET` = `your_secret_key_here`
- `JWT_REFRESH_SECRET` = `another_secret_key_here`
- `PORT` = `5000` (Render will override with its own port)

### **Optional:**
- `CLIENT_URL` = `https://hirex-ad9w.onrender.com` (for reference)
- `N8N_CRITIQUE_WEBHOOK_URL` = `your_n8n_webhook_url`

---

## 📝 How It Works

### **Production Mode** (`NODE_ENV=production`):
```
Request to https://hirex-ad9w.onrender.com/
  ↓
  ├─ /api/* → Express API routes
  └─ /* → React app (index.html from client/dist)
```

### **Local Development:**
```
Frontend: http://localhost:5173 (Vite dev server)
Backend:  http://localhost:5000 (Express server)
```

---

## 🧪 Testing

### **1. Test Root URL**
```bash
curl https://hirex-ad9w.onrender.com/
```
**Expected**: HTML content (the React app)

### **2. Test API**
```bash
curl https://hirex-ad9w.onrender.com/api/auth/me
```
**Expected**: JSON response from your API

### **3. Test in Browser**
Visit: `https://hirex-ad9w.onrender.com`
**Expected**: Your full React application UI

---

## 🐛 Troubleshooting

### Issue: Still seeing JSON instead of React app
**Solutions:**
1. ✅ Make sure `NODE_ENV=production` is set on Render
2. ✅ Check build logs - `client/dist` folder should be created
3. ✅ Verify build command completed successfully
4. ✅ Redeploy the service

### Issue: 404 on routes
**Solution**: The catch-all route (`app.get('*')`) should handle React routing. Make sure it's after all API routes.

### Issue: API calls failing
**Solution**: 
- In production, API calls go to the same domain
- Make sure `VITE_API_URL` is NOT set (or set to `/api`)
- In `client/src/api/axios.js`, it should use relative URLs in production

---

## 🔄 Deployment Checklist

- [x] Server configured to serve static files
- [x] Build command includes React build
- [x] Start command points to server
- [x] `NODE_ENV=production` set on Render
- [x] All secrets configured
- [ ] Push to GitHub
- [ ] Deploy on Render
- [ ] Test the deployed app

---

## 📦 What Gets Deployed

```
Project-ING1-s1/
├── server/
│   ├── index.js       ← Serves API + static files
│   ├── routes/
│   └── models/
└── client/
    └── dist/          ← Built React app (created during build)
        ├── index.html
        ├── assets/
        └── ...
```

---

## 💡 Key Changes Made

### In `server/index.js`:
1. ✅ Added static file serving for `client/dist`
2. ✅ Added catch-all route for React routing
3. ✅ Conditional behavior: production vs development
4. ✅ Updated CORS for same-domain setup

### How the server works now:
```javascript
// API routes (always active)
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
// ... other API routes

// Production: serve React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/dist'));
    app.get('*', (req, res) => {
        res.sendFile('client/dist/index.html');
    });
}
// Development: show API status
else {
    app.get('/', (req, res) => {
        res.json({ message: 'API is running' });
    });
}
```

---

## 🎉 Final Steps

1. **Push your changes:**
   ```bash
   git push origin deployemnt
   ```

2. **On Render:**
   - Make sure `NODE_ENV=production` is set
   - Trigger a new deploy (or it deploys automatically)

3. **Wait for build to complete** (~2-5 minutes)

4. **Visit your app:**
   - Open `https://hirex-ad9w.onrender.com`
   - You should see your React app! 🎊

---

## 🔗 URLs

- **Production App**: https://hirex-ad9w.onrender.com
- **API Endpoints**: https://hirex-ad9w.onrender.com/api/*

Everything is served from the same domain! 🚀
