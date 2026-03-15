# SniperThink - Full Stack Developer Assignment

This project contains both Frontend and Backend implementations for the SniperThink hiring assignment.

## Project Structure

```
SniperThink/
├── client/          # Frontend React application
├── server/          # Backend Node.js/Express application
└── README.md        # This file
```

## Part 1: Frontend - Interactive Strategy Flow

An interactive, scroll-based storytelling section that explains how SniperThink works.

### Features
- 4+ strategy steps with unique animations
- Scroll-based animations and smooth transitions
- Visual progress indicator
- Dynamic rendering from data source
- API integration for interest form
- Fully responsive design

### Tech Stack
- React 18 (Functional Components + Hooks)
- Framer Motion (Animations)
- Axios (API calls)
- Vite (Build tool)

## Part 2: Backend - Distributed File Processing System

A distributed file processing system with background workers and job queue.

### Features
- File upload (PDF/TXT, max 10MB)
- Redis-based job queue
- Background worker processing
- Job status tracking
- Retry mechanism for failed jobs
- Concurrency handling

### Tech Stack
- Node.js + Express.js
- Redis (Queue management)
- PostgreSQL (Database)
- BullMQ (Job queue)
- Multer (File uploads)
- pdf-parse (PDF processing)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v7 or higher)

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:

**Server (.env in server/ directory):**
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sniperthink
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
UPLOAD_DIR=./uploads
```

**Client (.env in client/ directory):**
```
VITE_API_URL=http://localhost:5000
```

3. Set up PostgreSQL database:
```bash
createdb sniperthink
```

4. Run database migrations:
```bash
cd server
npm run migrate
```

5. Start Redis server:
```bash
redis-server
```

6. Start the application:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

## API Documentation

### Frontend API

#### POST /api/interest
Submit interest form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "selectedStep": "step-1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your interest!"
}
```

### Backend API

#### POST /api/files/upload
Upload a file for processing.

**Request:** Multipart form data
- `file`: File (PDF or TXT, max 10MB)

**Response:**
```json
{
  "jobId": "12345",
  "message": "File uploaded successfully"
}
```

#### GET /api/jobs/:jobId/status
Get job status.

**Response:**
```json
{
  "jobId": "12345",
  "status": "processing",
  "progress": 60
}
```

#### GET /api/jobs/:jobId/result
Get processed results.

**Response:**
```json
{
  "jobId": "12345",
  "wordCount": 1200,
  "paragraphCount": 35,
  "topKeywords": ["system", "data", "process"]
}
```

## Database Schema

See `server/database/schema.sql` for complete schema definitions.

## Worker Setup

Start worker processes:
```bash
cd server
npm run worker
```

You can run multiple worker instances for concurrent processing.

## Deployment

### Frontend (Vercel)
1. Build the frontend: `cd client && npm run build`
2. Deploy to Vercel: `vercel deploy`

### Backend
Deploy to your preferred Node.js hosting platform (Heroku, Railway, etc.)

## Video Demo

Please refer to the video demonstration for:
- Architecture decisions
- Animation logic
- State management approach
- Queue functionality
- Live demonstration
