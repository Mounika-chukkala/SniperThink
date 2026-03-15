# Backend Video Script - Distributed File Processing System
**Duration:** 4-5 minutes

---

## Introduction (20 seconds)

"Hi, I'm [Your Name]. In this video, I'll walk you through the backend architecture of the SniperThink file processing system - a distributed system that handles asynchronous file processing using background workers and a job queue."

---

## Architecture Overview (1 minute)

"The backend follows a clean, scalable architecture:

**Project Structure:**
- `routes/` - API endpoints for file upload, job status, and results
- `models/` - Database models for Users, Files, Jobs, and Results
- `services/` - Business logic for file processing
- `workers/` - Background workers that consume jobs from the queue
- `config/` - Configuration for database, Redis, and queue

**Technology Stack:**
- Node.js + Express for the REST API
- PostgreSQL for persistent data storage
- Redis + BullMQ for job queue management
- PM2 for running both API and worker in production

The system is designed to handle multiple concurrent file processing jobs while maintaining data integrity and providing real-time progress tracking."

**[Show project structure in IDE]**

---

## Queue System & Worker Architecture (2 minutes)

"This is the heart of the distributed processing system:

**How It Works:**

1. **File Upload Flow:**
   - User uploads a file via POST `/api/files/upload`
   - File is validated (PDF/TXT, max 10MB) and stored on server
   - A job record is created in PostgreSQL with status 'pending'
   - Job is pushed to Redis queue using BullMQ with a unique string ID

2. **Job Queue (BullMQ):**
   - Uses Redis as the message broker
   - Supports multiple workers processing jobs concurrently
   - Built-in retry mechanism: 3 attempts with exponential backoff
   - Job locking ensures the same job isn't processed twice

3. **Worker Processing:**
   - Background worker consumes jobs from the queue
   - Processes up to 5 jobs concurrently (configurable)
   - Updates job status: pending → processing → completed/failed
   - Real-time progress updates: 0%, 20%, 40%, 60%, 80%, 100%
   - Extracts text from PDF/TXT files
   - Calculates word count, paragraph count, and top keywords
   - Stores results in database when complete

**Key Features:**
- **Concurrency:** Multiple jobs processed simultaneously
- **Retry Logic:** Failed jobs automatically retry 3 times
- **Progress Tracking:** Real-time progress updates stored in database
- **Error Handling:** Failed jobs are marked and logged for debugging

The queue system ensures scalability - you can add more worker instances to increase throughput without code changes."

**[Show queue.js and worker code]**

---

## Database Schema (30 seconds)

"The database uses PostgreSQL with four main tables:

- **Users** - stores user information (id, name, email)
- **Files** - tracks uploaded files (id, user_id, file_path, uploaded_at)
- **Jobs** - manages processing jobs (id, file_id, status, progress, created_at, updated_at)
- **Results** - stores processed results (id, job_id, word_count, paragraph_count, keywords)

All tables have proper foreign key relationships, indexes for performance, and triggers for automatic timestamp updates. The schema is idempotent - migrations can be run multiple times safely."

**[Show schema.sql]**

---

## API Endpoints (30 seconds)

"The system exposes RESTful APIs:

**File Upload:**
- `POST /api/files/upload` - Accepts multipart/form-data, returns jobId

**Job Status:**
- `GET /api/jobs/:jobId/status` - Returns current status (pending/processing/completed/failed) and progress (0-100)

**Results:**
- `GET /api/jobs/:jobId/result` - Returns processed results: word count, paragraph count, and top 10 keywords

**Migration:**
- `POST /api/migrate` - Runs database migrations (useful for deployment without shell access)

All endpoints include proper error handling, validation, and consistent JSON responses."

**[Show API routes code]**

---

## Live Demonstration (1 minute)

"Let me demonstrate the system in action:

**Step 1: Upload a File**
- [Upload a PDF or TXT file via Postman]
- Show the response with jobId
- Explain that the job is now in the queue

**Step 2: Check Job Status**
- [Query GET /api/jobs/{jobId}/status]
- Show status changing from 'pending' to 'processing'
- Show progress updates: 0%, 20%, 40%, 60%, 80%, 100%

**Step 3: Worker Processing**
- [Show worker terminal/logs]
- Show worker picking up the job
- Show processing logs and progress updates
- Demonstrate concurrent processing if multiple jobs exist

**Step 4: Get Results**
- [Query GET /api/jobs/{jobId}/result]
- Show the final results: word count, paragraph count, top keywords
- Explain that the job status is now 'completed'

The entire process is asynchronous - the API responds immediately while processing happens in the background. This ensures the API remains responsive even under heavy load."

**[Live demo with Postman/API client and terminal]**

---

## Production Deployment (30 seconds)

"For production deployment on Render:

- Single service runs both API server and worker using PM2
- Database migrations via HTTP endpoint (no shell access needed on free tier)
- Environment variables for all configuration
- Upstash Redis for queue management
- Proper error handling, logging, and graceful shutdown

The system is production-ready and can scale horizontally by adding more worker instances. Each worker can process up to 5 jobs concurrently, so adding workers linearly increases throughput."

**[Show deployment configuration]**

---

## Closing (20 seconds)

"This implementation demonstrates:
- Clean, maintainable architecture
- Scalable distributed processing
- Real-time progress tracking
- Robust error handling and retry logic
- Production-ready deployment setup

The complete codebase is available on GitHub. Thank you for watching!"

---

## Recording Tips:

1. **Screen Setup:**
   - Split screen: IDE (code) + Postman/API client + Terminal (worker logs)
   - Or switch between views smoothly

2. **Key Points to Show:**
   - Queue configuration in `config/queue.js`
   - Worker implementation in `workers/fileProcessor.js`
   - API routes handling file upload and status
   - Database schema and models
   - Live job processing in action

3. **Demonstration Flow:**
   - Upload file → Show jobId
   - Check status → Show progress updates
   - Show worker logs → Demonstrate processing
   - Get results → Show final output

4. **Emphasize:**
   - Asynchronous processing
   - Concurrency handling
   - Retry mechanism
   - Progress tracking
   - Scalability

---

## Timing Breakdown:

- Introduction: 20s
- Architecture Overview: 1m
- Queue System & Workers: 2m
- Database Schema: 30s
- API Endpoints: 30s
- Live Demo: 1m
- Production Deployment: 30s
- Closing: 20s

**Total: ~6 minutes** (can be trimmed to 4-5 minutes by speaking faster or condensing)
