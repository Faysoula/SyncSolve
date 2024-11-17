# SyncSolve

## Overview
SyncSolve is a collaborative programming platform that enables teams to practice coding interview questions and programming competitions together in real-time. The platform features a synchronized code editor, real-time collaboration tools, and integrated testing capabilities.

## Table of Contents
- [Project Setup](#project-setup)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Third-Party Dependencies](#third-party-dependencies)

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm package manager

### Environment Setup
1. Clone the repository:
```bash
git clone [repository-url]
cd syncsolve
```

2. Install dependencies for both backend and frontend:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Create `.env` file in the backend directory with the following variables:
```env
# Database
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3001

# Judge0 API
RAPIDAPI_KEY=your_rapidapi_key
```

4. Create `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001
```

### Running the Application
1. Start the backend server:
```bash
cd back
npm run dev
```

2. Start the frontend development server:
```bash
cd front
npm start
```

The application should now be running at `http://localhost:3000`

## Architecture

### Frontend
- React.js with functional components and hooks
- Material-UI for UI components
- Socket.IO client for real-time features
- Monaco Editor for code editing
- Context API for state management

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- Sequelize ORM for database operations
- JWT for authentication
- Judge0 API integration for code execution

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Teams Table
```sql
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Problems Table
```sql
CREATE TABLE problems (
    problem_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    test_cases JSON NOT NULL,
    metadata JSON NOT NULL DEFAULT '{}'
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(team_id),
    problem_id INTEGER REFERENCES problems(problem_id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);
```

### Team Members Table
```sql
CREATE TABLE team_members (
    team_member_id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(team_id),
    user_id INTEGER REFERENCES users(user_id),
    role VARCHAR(20) CHECK (role IN ('member', 'admin')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API Documentation

### Authentication Endpoints

#### POST /api/users/register
Register a new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "name": "string",
  "last_name": "string"
}
```

#### POST /api/users/login
Login user
```json
{
  "email": "string",
  "password": "string"
}
```

### Problems Endpoints

#### GET /api/problems/getAllProblems
Get all problems

#### POST /api/problems/addProblem
Create new problem
```json
{
  "title": "string",
  "description": "string",
  "difficulty": "easy|medium|hard",
  "created_by": "number",
  "test_cases": [
    {
      "input": "string",
      "expected_output": "string"
    }
  ],
  "tags": ["string"]
}
```

#### GET /api/problems/getProblemBYDifficulty/:difficulty
Get problems by difficulty level

### Teams Endpoints

#### POST /api/teams/Createteam
Create a new team
```json
{
  "team_name": "string",
  "created_by": "number"
}
```

#### GET /api/teams
Get all teams

#### POST /api/team-members/addMembers
Add member to team
```json
{
  "team_id": "number",
  "user_id": "number",
  "role": "member|admin"
}
```

### Sessions Endpoints

#### POST /api/sessions/CreateSession
Create a new coding session
```json
{
  "team_id": "number",
  "problem_id": "number"
}
```

## Third-Party Dependencies

### Frontend
- `@monaco-editor/react`: Code editor component
- `@mui/material`: UI component library
- `socket.io-client`: Real-time communication
- `axios`: HTTP client
- `react-router-dom`: Routing
- `lucide-react`: Icons

### Backend
- `express`: Web framework
- `sequelize`: ORM
- `socket.io`: Real-time server
- `jsonwebtoken`: Authentication
- `bcrypt`: Password hashing
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `judge0 api`: running the code

