# 📄 Resume Builder

A full-stack Resume Builder app with React frontend, Node.js backend, and MongoDB.

## Features
- User Authentication (Register/Login with JWT)
- Create, edit, delete multiple resumes
- Sections: Personal Info, Experience, Education, Skills, Projects
- Live resume preview with print support
- MongoDB persistent storage

## Project Structure
```
resume-builder/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── server.js
├── frontend/         # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── context/
└── README.md
```

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev     # development with nodemon
# or
npm start       # production
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_secret_key
NODE_ENV=development
```

The app runs at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
