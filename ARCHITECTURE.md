# Architecture & Implementation Guide

## Project Overview

This project implements a full-stack application with:
1. **Frontend**: Interactive Strategy Flow with scroll-based animations
2. **Backend**: Distributed file processing system with background workers

---

## Part 1: Frontend Architecture

### Technology Stack
- **React 18**: Functional components with hooks
- **Framer Motion**: Animation library for smooth transitions
- **Axios**: HTTP client for API calls
- **Vite**: Build tool and dev server

### Component Structure

```
client/src/
├── components/
│   ├── InteractiveStrategyFlow.jsx    # Main container component
│   ├── StrategyStep.jsx                # Individual step component
│   ├── ProgressIndicator.jsx          # Progress tracking component
│   └── InterestForm.jsx               # Form modal component
├── data/
│   └── strategySteps.js                # Dynamic data source
└── App.jsx                            # Root component
```

### Key Features

#### 1. Scroll-Based Animations
- Uses `framer-motion`'s `useScroll` hook to track scroll progress
- Each step animates when entering viewport using `useInView`
- Progress indicator updates based on scroll position

#### 2. Dynamic Rendering
- Steps are rendered from `strategySteps.js` data source
- Easy to add/modify steps without changing component code
- Each step has unique animation type (slideInLeft, scaleUp, etc.)

#### 3. Interactive Elements
- **Hover Effects**: 3D transform on step cards
- **Click Interactions**: Progress indicator steps are clickable
- **Scroll Progress**: Visual progress bar updates in real-time

#### 4. State Management
- `useState` for local component state
- `useRef` for DOM references
- `useEffect` for side effects and scroll tracking

#### 5. API Integration
- POST request to `/api/interest` endpoint
- Loading states during submission
- Error handling with user feedback
- Success animation on completion

### Animation Strategy

1. **Entry Animations**: Each step has unique entry animation based on `animationType`
2. **Scroll Animations**: Progress bar and active step update based on scroll position
3. **Hover Animations**: 3D perspective transforms on mouse movement
4. **Active State**: Active step scales up and highlights

### Performance Optimizations

- Components only re-render when necessary
- Animations use GPU acceleration (transform properties)
- Lazy loading for images (if added)
- Debounced scroll handlers

---

## Part 2: Backend Architecture

### Technology Stack
- **Node.js + Express**: REST API server
- **PostgreSQL**: Relational database
- **Redis**: Queue management
- **BullMQ**: Job queue system
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction

### System Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   Express   │
│    Server   │
└──────┬──────┘
       │
       ├──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼
   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
   │Users │  │Files │  │ Jobs │  │Results│
   └──────┘  └──────┘  └──────┘  └──────┘
       │          │          │          │
       └──────────┴──────────┴──────────┘
                    │
                    ▼
              ┌──────────┐
              │PostgreSQL│
              └──────────┘

┌─────────────┐
│   Express   │
│    Server   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   BullMQ    │
│    Queue    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Redis     │
└─────────────┘
       │
       ▼
┌─────────────┐
│   Workers   │
│ (Background)│
└─────────────┘
```

### Directory Structure

```
server/
├── config/
│   ├── database.js      # PostgreSQL connection pool
│   ├── redis.js         # Redis connection
│   └── queue.js         # BullMQ queue configuration
├── models/
│   ├── User.js          # User model
│   ├── File.js          # File model
│   ├── Job.js           # Job model
│   └── Result.js        # Result model
├── routes/
│   ├── interest.js      # Interest form endpoint
│   ├── files.js         # File upload endpoint
│   └── jobs.js          # Job status/result endpoints
├── services/
│   └── fileProcessor.js # File processing logic
├── workers/
│   └── fileProcessor.js # Background worker
└── database/
    ├── schema.sql       # Database schema
    └── migrate.js       # Migration script
```

### Database Schema

#### Users Table
- `id`: Primary key
- `name`: User name
- `email`: Unique email address
- `created_at`: Timestamp

#### Files Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `file_path`: Path to uploaded file
- `uploaded_at`: Timestamp

#### Jobs Table
- `id`: Primary key
- `file_id`: Foreign key to files
- `status`: pending | processing | completed | failed
- `progress`: 0-100 percentage
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### Results Table
- `id`: Primary key
- `job_id`: Foreign key to jobs (unique)
- `word_count`: Total word count
- `paragraph_count`: Total paragraph count
- `keywords`: JSONB array of top keywords
- `created_at`: Timestamp

### Queue System (BullMQ)

#### Configuration
- **Queue Name**: `file-processing`
- **Connection**: Redis
- **Retry Strategy**: 3 attempts with exponential backoff
- **Job Retention**: Completed jobs kept for 1 hour, failed for 24 hours

#### Job Flow

1. **Upload**: File uploaded → Job created → Added to queue
2. **Processing**: Worker picks job → Updates status to "processing"
3. **Progress**: Worker updates progress (0-100%)
4. **Completion**: Results saved → Status updated to "completed"
5. **Failure**: On error → Status updated to "failed" → Retry if attempts remain

### Worker System

#### Features
- **Concurrency**: Up to 5 jobs processed simultaneously
- **Rate Limiting**: Max 10 jobs per second
- **Error Handling**: Automatic retry on failure
- **Progress Tracking**: Real-time progress updates

#### Processing Steps

1. Extract text from file (PDF or TXT)
2. Count words
3. Count paragraphs
4. Extract top keywords (removes stop words, counts frequency)
5. Save results to database

### API Endpoints

#### POST /api/interest
- **Purpose**: Submit interest form
- **Body**: `{ name, email, selectedStep }`
- **Response**: Success message

#### POST /api/files/upload
- **Purpose**: Upload file for processing
- **Body**: Multipart form data with file
- **Response**: `{ jobId, message }`

#### GET /api/jobs/:jobId/status
- **Purpose**: Get job status
- **Response**: `{ jobId, status, progress }`

#### GET /api/jobs/:jobId/result
- **Purpose**: Get processed results
- **Response**: `{ jobId, wordCount, paragraphCount, topKeywords }`

### Concurrency & Race Conditions

#### Job Locking
- BullMQ ensures only one worker processes a job at a time
- Redis provides atomic operations for job state

#### Database Transactions
- Job status updates are atomic
- Results are created only after successful processing

#### Retry Mechanism
- Failed jobs automatically retry up to 3 times
- Exponential backoff prevents system overload
- After 3 failures, job marked as "failed"

### Error Handling

1. **File Upload Errors**: Invalid type, size exceeded
2. **Processing Errors**: File read failure, parsing errors
3. **Database Errors**: Connection issues, constraint violations
4. **Queue Errors**: Redis connection failures

All errors are logged and appropriate HTTP status codes returned.

---

## Deployment Considerations

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_API_URL`

### Backend
- Requires PostgreSQL and Redis instances
- Worker processes should run separately
- File storage: Consider cloud storage (S3) for production
- Environment variables: Database and Redis connections

### Scaling
- **Workers**: Can scale horizontally (multiple worker instances)
- **API Server**: Can scale horizontally (stateless)
- **Database**: Use connection pooling (configured)
- **Redis**: Can use Redis Cluster for high availability

---

## Security Considerations

1. **File Upload**: File type validation, size limits
2. **SQL Injection**: Parameterized queries (pg library)
3. **CORS**: Configured for frontend origin
4. **Environment Variables**: Sensitive data in .env files
5. **File Storage**: Files stored server-side (consider cloud storage)

---

## Testing Recommendations

### Frontend
- Component unit tests
- Integration tests for API calls
- E2E tests for user flows

### Backend
- Unit tests for services
- Integration tests for API endpoints
- Worker processing tests
- Database migration tests

---

## Future Enhancements

1. **Authentication**: User authentication and authorization
2. **File Storage**: Cloud storage integration (S3, GCS)
3. **WebSockets**: Real-time job status updates
4. **Caching**: Redis caching for frequently accessed data
5. **Monitoring**: Logging and monitoring (Winston, Prometheus)
6. **Rate Limiting**: API rate limiting middleware
