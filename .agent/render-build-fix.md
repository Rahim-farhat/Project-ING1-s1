# 🔧 Updated Render Configuration

## Build Command (FIXED):
```bash
cd server && npm install && cd ../client && npm install --production=false && npm run build
```

**Key Change**: Added `--production=false` to the client npm install to ensure devDependencies (including Vite) are installed.

## Start Command:
```bash
node server/index.js
```

## Root Directory:
Leave **empty**

## Environment Variables:
- `NODE_ENV=production` ← **CRITICAL**
- `MONGO_URI=your_mongodb_connection_string`
- `JWT_ACCESS_SECRET=your_secret_key`
- `JWT_REFRESH_SECRET=another_secret_key`
- Other variables as needed

---

## Why the Build Failed:

The error `sh: 1: vite: not found` occurred because:
1. Vite is listed as a **devDependency** in `client/package.json`
2. By default, `npm install` in production mode skips devDependencies
3. The build script needs Vite to run `vite build`

**Solution**: Use `npm install --production=false` to install ALL dependencies including devDependencies during the build phase.

---

## Alternative: Move Vite to dependencies (if needed)

If the above doesn't work, you can move Vite to dependencies in `client/package.json`:

```json
{
  "dependencies": {
    "axios": "^1.13.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.10.1",
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1"
  }
}
```

But using `--production=false` is the standard approach.
