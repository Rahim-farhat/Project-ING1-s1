# Full-Stack Authentication System

A complete JWT-based authentication system with React frontend and Node.js backend.

## ✨ Features

- 🔐 **JWT Authentication** - Access & refresh tokens with automatic refresh
- 🛡️ **Security** - bcrypt password hashing, httpOnly cookies, rate limiting, CORS
- 💾 **Dual Storage** - MongoDB or JSON file storage (automatic detection)
- 🎨 **Premium UI** - Dark mode with gradients, glassmorphism, smooth animations
- ✅ **Form Validation** - Client-side email and password validation
- 📱 **Responsive** - Works on all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- (Optional) MongoDB database

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (IMPORTANT!)
# Copy .env.example to .env and update values
# For development, you can leave MONGO_URI empty to use JSON file storage
```

Create `server/.env`:
```env
MONGO_URI=
PORT=5000
NODE_ENV=development

JWT_ACCESS_SECRET=your_super_secret_access_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

```bash
# Start the server
npm run dev
```

Server will run on http://localhost:5000

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend will run on http://localhost:5173 (or 5174 if 5173 is in use)

### 3. Test the Application

1. Open http://localhost:5173 in your browser
2. Click "S'inscrire" to register a new account
3. Fill in username, email, and password (min 8 characters)
4. You'll be redirected to the dashboard
5. Test logout and login

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/me` | Get current user info | Yes |

### Example: Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔒 Security Features

- ✅ **bcrypt** password hashing (12 salt rounds)
- ✅ **JWT** access tokens (15min) & refresh tokens (7 days)
- ✅ **httpOnly cookies** for refresh tokens
- ✅ **Rate limiting** - 5 attempts per 15 minutes
- ✅ **Token blacklist** - Invalid tokens stored in database
- ✅ **CORS** configured for frontend
- ✅ **Input validation** on client and server

## 🗂️ Storage Modes

### JSON File Mode (Default)
Perfect for development without MongoDB:
- Users stored in `server/data/users.json`
- Tokens stored in `server/data/refreshTokens.json`
- Automatically created on first use

### MongoDB Mode
Set `MONGO_URI` in `server/.env`:
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/authdb
```

## 📁 Project Structure

```
Project-ING1-s1/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/            # Axios configuration
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Login, Register, Dashboard
│   │   └── ...
│   └── package.json
│
└── server/                  # Node.js backend
    ├── controllers/        # Route controllers
    ├── middleware/         # Auth & error middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── utils/              # File storage utility
    └── package.json
```

## 🎨 UI Screenshots

The application features a modern dark theme with:
- Animated gradient backgrounds
- Glassmorphic cards
- Smooth transitions and hover effects
- Premium color palette (indigo/purple gradients)
- Responsive design

## 🧪 Testing

### Manual Testing
1. Register a new user
2. Verify form validation (try invalid email, short password)
3. Login with the registered user
4. Access the dashboard
5. Logout
6. Try accessing dashboard while logged out (should redirect)
7. Login again

### Rate Limiting Test
Try logging in with wrong password 6 times rapidly. You should receive:
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again later"
}
```

## 🛠️ Technologies

### Backend
- Node.js & Express
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- Mongoose (MongoDB ODM)
- cookie-parser (cookie handling)
- express-rate-limit (rate limiting)
- CORS

### Frontend
- React 19
- React Router DOM (routing)
- Axios (HTTP client)
- Vite (build tool)
- Modern CSS with animations

## 📝 Environment Variables

### Server (.env)
```env
MONGO_URI=                    # MongoDB connection (optional)
PORT=5000                     # Server port
NODE_ENV=development          # Environment
JWT_ACCESS_SECRET=secret1     # JWT access token secret
JWT_REFRESH_SECRET=secret2    # JWT refresh token secret
JWT_ACCESS_EXPIRES_IN=15m     # Access token expiration
JWT_REFRESH_EXPIRES_IN=7d     # Refresh token expiration
CLIENT_URL=http://localhost:5173  # Frontend URL for CORS
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in server/.env
2. Use strong, random JWT secrets
3. Enable HTTPS (cookies will be secure automatically)
4. Set `MONGO_URI` to production database
5. Build frontend: `cd client && npm run build`
6. Serve built files from `client/dist`

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to enhance this project! Some ideas:
- Email verification
- Password reset functionality
- Two-factor authentication
- OAuth social login
- User profile management
