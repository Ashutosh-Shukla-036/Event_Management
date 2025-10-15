# Event Management API

A robust REST API for managing events and user registrations built with Node.js, Express, Prisma, and PostgreSQL.

---

## Features

- Create and manage events with capacity limits  
- User registration system  
- Event registration with validation  
- Prevent duplicate registrations  
- Block registration for past events  
- Event capacity management  
- Custom sorting for upcoming events  
- Comprehensive event statistics  

---

## Tech Stack

- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Database**: PostgreSQL (Supabase or local Docker)  
- **ORM**: Prisma  
- **Validation**: Custom middleware  

---

## Setup Instructions

### Option 1: Using Docker (Recommended)

Run backend and PostgreSQL in a single command. No manual `npm install` required.

```bash
git clone https://github.com/yourusername/event-management-api.git
cd event-management-api/backend

# create .env folder in Backend
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

# Build and start containers
docker-compose up --build
```
- The backend server installs all npm dependencies automatically.

- PostgreSQL database starts and is linked.

- The API will be available at: `http://localhost:3000`
- Press Ctrl+C to stop the containers.
- To run in detached mode: `docker-compose up -d`
-To stop and remove containers: `docker-compose down`


## Option 2: Manual Setup (Without Docker)
```bash
git clone https://github.com/yourusername/event-management-api.git
cd event-management-api/backend

# Install dependencies
npm install

# Ensure PostgreSQL is running locally in .env
DATABASE_URL="String_URL"

# Then start the server
npm start

# run prisma generate
npx prisma generate

# run prisma migration
npx prisma migrate dev --name init                                

#The API will be available at:

http://localhost:3000

```
---

### API Endpoints
```bash
# Create user
POST http://localhost:3000/api/users 
{
   "name": "John Doe",
   "email": "john@example.com"
}
# Success: 201 Created
{
  "message": "User created successfully",
  "userId": "uuid",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

#Get All Users
GET http://localhost:3000/api/users
# Success: 200 OK
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-10-15T12:00:00.000Z"
    }
  ]
}

#Get User by ID
GET http://localhost:3000/api/users/{userId}
#Success: 200 OK
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "registrations": [
      {
        "event": {
          "id": "uuid",
          "title": "Tech Conference 2025",
          "dateTime": "2025-11-20T10:00:00.000Z"
        }
      }
    ]
  }
}

# Create Event

POST http://localhost:3000/api/events 
{
    "title": "Tech Conference 2025",
    "dateTime": "2025-11-20T10:00:00.000Z",
    "location": "San Francisco",
    "capacity": "500"
}
#Success: 201 Created

# Get Event Details
GET http://localhost:3000/api/events/{eventId}
# Success: 200 OK

# Register for Event
POST http://localhost:3000/api/events/{eventId}/register 
{
    "userId": "{userId}"
}
# Success: 201 Created

# Cancel Registration
DELETE http://localhost:3000/api/events/{eventId}/register 
{
    "userId": "{userId}"
}
# Success: 200 OK

# List Upcoming Events
GET http://localhost:3000/api/events/upcoming

# Event Statistics
GET http://localhost:3000/api/events/{eventId}/stats
```
## Business Logic
- No Duplicate Registrations

- Capacity Limits: 1–1000 attendees

- Past Events cannot be registered

- Only existing users can register

- Concurrent Safety ensured by DB constraints

---

# Error Handling
```bash
200 → Success (GET, DELETE)

201 → Created (POST)

400 → Bad Request (validation errors)

404 → Not Found

409 → Conflict (duplicate entries)

500 → Internal Server Error
```
---
# Database Schema
```bash
Users: id, name, email, created_at, updated_at

Events: id, title, date_time, location, capacity, created_at, updated_at

Registrations: id, user_id, event_id, registered_at (unique on user_id+event_id)
```
# Project Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── package.json
├── .env
└── README.md
```