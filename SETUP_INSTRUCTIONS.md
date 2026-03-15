# Setup Instructions

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify: `psql --version`

3. **Redis** (v7 or higher)
   
   **Docker (Recommended - Easiest):**
   ```powershell
   # Install Docker Desktop from https://www.docker.com/products/docker-desktop
   # Then run:
   docker run -d -p 6379:6379 --name redis redis:7-alpine
   ```
   
   **Verify Installation:**
   ```bash
   # If using Docker, use:
   docker exec -it redis redis-cli ping
   

## Step-by-Step Setup

### 1. Clone/Download the Repository

```bash
cd SniperThink
```

### 2. Install Dependencies

Install all dependencies for root, server, and client:

```bash
npm run install-all
```

Or install manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Set Up Environment Variables

#### Server Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sniperthink
DB_USER=postgres
DB_PASSWORD=your_postgres_password
REDIS_HOST=localhost
REDIS_PORT=6379
UPLOAD_DIR=./uploads
```

#### Client Environment Variables

Create a `.env` file in the `client/` directory:

```bash
cd client
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Set Up PostgreSQL Database

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sniperthink;

# Exit psql
\q
```

#### Run Migrations

```bash
cd server
npm run migrate
```

This will create all necessary tables:
- `users`
- `files`
- `jobs`
- `results`

### 5. Start Redis Server

#### Windows

**If using Docker:**
```powershell
# Start Redis container (if not already running)
docker start redis

# Or create new container if first time
docker run -d -p 6379:6379 --name redis redis:7-alpine
```
**Verify Redis is running:**

**Docker:**
```powershell
docker exec -it redis redis-cli ping
```


**All methods should return:** `PONG`

### 6. Start the Application

#### Option 1: Run Both Server and Client Together

From the root directory:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 - Worker (Required for file processing):**
```bash
cd server
npm run worker
```

### 7. Verify Installation

1. **Check Backend Health:**
   - Open: http://localhost:5000/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend:**
   - Open: http://localhost:5173
   - Should see the SniperThink Interactive Strategy Flow

3. **Test File Upload:**
   - Use the file upload API or a tool like Postman
   - Upload a PDF or TXT file
   - Check job status via `/api/jobs/:jobId/status`

## Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
- Ensure PostgreSQL is running: `pg_isready`
- Check credentials in `server/.env`
- Verify database exists: `psql -U postgres -l`

**Error: "password authentication failed"**
- Update password in `server/.env`
- Or reset PostgreSQL password

### Redis Connection Issues

**Error: "ECONNREFUSED" or "redis-cli not recognized"**

**Windows:**
- **Docker**: Ensure container is running: `docker ps` (should see redis container)
  - Start if stopped: `docker start redis`
  - Verify: `docker exec -it redis redis-cli ping`

**General:**
- Check Redis host/port in `server/.env` (default: localhost:6379)
- Verify Redis is listening on correct port: `netstat -an | findstr 6379` (Windows) or `netstat -an | grep 6379` (Mac/Linux)
- If using Docker, ensure port mapping is correct: `docker run -d -p 6379:6379 ...`

### Port Already in Use

**Error: "Port 5000 already in use"**
- Change `PORT` in `server/.env`
- Or stop the process using port 5000

**Error: "Port 5173 already in use"**
- Change port in `client/vite.config.js`
- Or stop the process using port 5173

### Worker Not Processing Jobs

- Ensure worker is running: `cd server && npm run worker`
- Check Redis connection
- Verify queue configuration
- Check worker logs for errors

### File Upload Issues

**Error: "File too large"**
- Maximum file size is 10MB
- Check file size before uploading

**Error: "Only PDF and TXT files are allowed"**
- Ensure file extension is `.pdf` or `.txt`
- Check file MIME type

