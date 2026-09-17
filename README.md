# CEC PYQ Hub

Previous year question papers portal for Chaibasa Engineering College (CEC), affiliated with Jharkhand University of Technology (JUT), Ranchi.

Students can filter papers by branch and semester, preview question papers directly in the browser, download PDFs, and upload papers from recent exams.

## Supported Branches
- CSE (Computer Science & Engineering)
- ECE (Electronics & Communication)
- EE (Electrical Engineering)
- ME (Mechanical Engineering)
- CE (Civil Engineering)

## Tech Stack
- React + Vite
- Node.js & Express
- MongoDB Atlas
- Cloudinary (PDF & Image hosting)
- Vercel

## Local Setup

1. Install dependencies:
```bash
npm install
cd server
npm install
cd ..
```

2. Create `server/.env` (refer to `server/.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Start development servers:
```bash
# Frontend
npm run dev

# Backend (in a separate terminal)
cd server
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Deploy on Vercel
1. Import the repository in Vercel.
2. Add environment variables (`MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
3. Click Deploy.
