# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Frontend API

### POST /api/interest
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

**Error Response:**
```json
{
  "success": false,
  "message": "Name, email, and selectedStep are required"
}
```

---

## Backend API

### POST /api/files/upload
Upload a file for processing.

**Request:** 
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File (PDF or TXT, max 10MB)
  - `name`: (optional) User name
  - `email`: (optional) User email

**Response:**
```json
{
  "success": true,
  "jobId": "12345",
  "message": "File uploaded successfully"
}
```

**Error Responses:**

File too large:
```json
{
  "success": false,
  "message": "File too large"
}
```

Invalid file type:
```json
{
  "success": false,
  "message": "Only PDF and TXT files are allowed"
}
```

---

### GET /api/jobs/:jobId/status
Get the current status of a processing job.

**Parameters:**
- `jobId`: Job identifier (integer)

**Response:**
```json
{
  "success": true,
  "jobId": "12345",
  "status": "processing",
  "progress": 60
}
```

**Possible Status Values:**
- `pending`: Job is waiting to be processed
- `processing`: Job is currently being processed
- `completed`: Job has completed successfully
- `failed`: Job failed to process

**Error Response:**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### GET /api/jobs/:jobId/result
Get the processed results for a completed job.

**Parameters:**
- `jobId`: Job identifier (integer)

**Response:**
```json
{
  "success": true,
  "jobId": "12345",
  "wordCount": 1200,
  "paragraphCount": 35,
  "topKeywords": ["system", "data", "process", "file", "processing"]
}
```

**Error Responses:**

Job not found:
```json
{
  "success": false,
  "message": "Job not found"
}
```

Job not completed:
```json
{
  "success": false,
  "message": "Job is processing. Results are only available for completed jobs."
}
```

---

## Example Usage

### Upload a file and track processing:

```javascript
// 1. Upload file
const formData = new FormData()
formData.append('file', fileInput.files[0])

const uploadResponse = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
})

const { jobId } = await uploadResponse.json()

// 2. Poll for status
const checkStatus = async () => {
  const statusResponse = await fetch(`/api/jobs/${jobId}/status`)
  const { status, progress } = await statusResponse.json()
  
  if (status === 'completed') {
    // 3. Get results
    const resultResponse = await fetch(`/api/jobs/${jobId}/result`)
    const result = await resultResponse.json()
    console.log(result)
  } else if (status === 'failed') {
    console.error('Job failed')
  } else {
    // Continue polling
    setTimeout(checkStatus, 1000)
  }
}

checkStatus()
```

---

## Health Check

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
