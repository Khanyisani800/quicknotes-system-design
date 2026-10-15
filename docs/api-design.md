# QuickNotes REST API Design Document

## REST Endpoints Overview

| Method | Endpoint Path | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user and receive a JWT token | `200 OK` |
| `GET` | `/api/v1/notes` | List all notes for the authenticated user | `200 OK` |
| `POST` | `/api/v1/notes` | Create a new note | `201 Created` |
| `GET` | `/api/v1/notes/:id` | Fetch details for a specific note by ID | `200 OK` |
| `PUT` | `/api/v1/notes/:id` | Update an existing note by ID | `200 OK` |
| `DELETE` | `/api/v1/notes/:id` | Delete a note by ID | `204 No Content` |

---

## JSON Examples

### 1. Create a Note (`POST /api/v1/notes`)

**Request:**
```json
{
  "title": "System Architecture Review",
  "body": "Discuss load balancing and DB replication strategy with the infrastructure team.",
  "tag_ids": [1, 3]
}


{
  "id": "e8d4c9a2-4f1e-432a-9310-864b971c22a1",
  "user_id": "u_987654321",
  "title": "System Architecture Review",
  "body": "Discuss load balancing and DB replication strategy with the infrastructure team.",
  "tags": [
    { "id": 1, "name": "Work" },
    { "id": 3, "name": "Architecture" }
  ],
  "created_at": "2026-10-15T10:00:00Z",
  "updated_at": "2026-10-15T10:00:00Z"
}

{
  "data": [
    {
      "id": "e8d4c9a2-4f1e-432a-9310-864b971c22a1",
      "title": "System Architecture Review",
      "body": "Discuss load balancing and DB replication strategy with the infrastructure team.",
      "tags": ["Work", "Architecture"],
      "created_at": "2026-10-15T10:00:00Z"
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Grocery List",
      "body": "Milk, Eggs, Coffee beans, Oats",
      "tags": ["Personal"],
      "created_at": "2026-10-14T18:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_count": 2
  }
}
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid note creation payload.",
    "status": 400,
    "details": [
      {
        "field": "title",
        "issue": "Title length exceeds maximum allowed limit of 100 characters."
      }
    ],
    "timestamp": "2026-10-15T10:05:00Z"
  }
}


