# **SyncSolve Platform**

## **Project Description**

SyncSolve is a real-time collaborative coding platform that enables teams to solve programming challenges together. Users can work simultaneously on coding problems with features like live code synchronization, team management, and AI-powered assistance. The platform emphasizes scalability, real-time collaboration, and test-driven development with a secure Node.js backend and responsive React frontend.

---

## **Features**

- **Real-Time Collaboration**: Multiple users can code together with synchronized editing
- **Team Management**: Support for team creation, roles, and member management
- **Live Code Testing**: Integrated code execution and test case validation
- **AI Code Assistance**: Code suggestions and hints using OpenAI APIs
- **Session Management**: Track and manage coding sessions with automatic progress saving
- **Built-in Communication**: Real-time chat and voice calls for team collaboration
- **Multi-language Support**: Support for multiple programming languages (Python, Java, C++)

---

## **Backend Routes**

### **Authentication**

| Method | Endpoint           | Description            | Status Codes |
|--------|-------------------|------------------------|--------------|
| POST   | `/users/register` | Register new user      | 201, 400     |
| POST   | `/users/login`    | Sign in user          | 200, 401     |
| GET    | `/users/me`       | Get current user      | 200, 401     |
| PUT    | `/users/:id`      | Update user profile   | 200, 400     |

### **Teams**

| Method | Endpoint                    | Description                  | Status Codes |
|--------|----------------------------|------------------------------|--------------|
| POST   | `/teams/Createteam`        | Create new team             | 201, 400     |
| GET    | `/teams`                   | Get all teams               | 200, 401     |
| GET    | `/teams/:id`               | Get team by ID              | 200, 404     |
| GET    | `/teams/:id/members`       | Get team members            | 200, 401     |
| PUT    | `/teams/:id`               | Update team                 | 200, 400     |
| DELETE | `/teams/:id`               | Delete team                 | 200, 404     |

### **Problems**

| Method | Endpoint                          | Description                | Status Codes |
|--------|------------------------------------|---------------------------|--------------|
| POST   | `/problems/addProblem`            | Create new problem        | 201, 400     |
| GET    | `/problems/getAllProblems`        | Get all problems          | 200, 401     |
| GET    | `/problems/:id`                   | Get problem by ID         | 200, 404     |
| PUT    | `/problems/updateProblem/:id`     | Update problem            | 200, 400     |
| DELETE | `/problems/deleteProblem/:id`     | Delete problem            | 200, 404     |

### **Sessions**

| Method | Endpoint                      | Description              | Status Codes |
|--------|------------------------------|--------------------------|--------------|
| POST   | `/sessions/CreateSession`    | Create coding session    | 201, 400     |
| GET    | `/sessions`                  | Get all sessions         | 200, 401     |
| GET    | `/sessions/session/:id`      | Get session by ID        | 200, 404     |
| PUT    | `/sessions/:id/end`          | End session             | 200, 400     |
| DELETE | `/sessions/session/:id/delete`| Delete session          | 200, 404     |

### **Executions**

| Method | Endpoint                   | Description              | Status Codes |
|--------|---------------------------|--------------------------|--------------|
| POST   | `/executions/createEx`    | Execute code            | 201, 400     |
| GET    | `/executions`             | Get all executions      | 200, 401     |
| GET    | `/executions/:id`         | Get execution by ID     | 200, 404     |

### **Terminal Sessions**

| Method | Endpoint                     | Description                | Status Codes |
|--------|----------------------------|----------------------------|--------------|
| POST   | `/terminal/createTerminal` | Create terminal session    | 201, 400     |
| GET    | `/terminal/:id`            | Get terminal session      | 200, 404     |
| PUT    | `/terminal/:id`            | Update terminal session   | 200, 400     |
| DELETE | `/terminal/:id`            | Delete terminal session   | 200, 404     |

---

## **Database Diagram**

### **PostgreSQL Tables**
1. **Users**: User account information
    - **Columns**: `user_id`, `username`, `email`, `password_hash`, `name`, `last_name`, `created_at`

2. **Teams**: Team information
    - **Columns**: `team_id`, `team_name`, `created_at`

3. **TeamMembers**: Team membership and roles
    - **Columns**: `team_member_id`, `team_id`, `user_id`, `role`, `joined_at`

4. **Problems**: Coding problems
    - **Columns**: `problem_id`, `title`, `description`, `difficulty`, `created_by`, `created_at`, `test_cases`, `metadata`

5. **Sessions**: Coding sessions
    - **Columns**: `session_id`, `team_id`, `problem_id`, `started_at`, `ended_at`

6. **SessionSnapshots**: Code snapshots
    - **Columns**: `snapshot_id`, `session_id`, `code_snapshot`, `created_at`

7. **TerminalSessions**: Terminal instances
    - **Columns**: `terminal_id`, `session_id`, `language`, `active`, `last_active`, `created_at`

8. **Executions**: Code execution records
    - **Columns**: `execution_id`, `user_id`, `code`, `result`, `status`, `executed_at`, `terminal_id`

---

## **Libraries Used**

### **Frontend**
- **React.js**: UI framework
- **Material-UI**: Component library
- **Monaco Editor**: Code editor
- **Socket.IO Client**: Real-time features
- **Axios**: HTTP client
- **React Router DOM**: Navigation
- **Tailwind CSS**: Utility styling
- **Recharts**: Data visualization

### **Backend**
- **Express.js**: Web framework
- **Sequelize**: PostgreSQL ORM
- **Socket.IO**: Real-time communication
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Judge0 API**: Code execution
- **OpenAI API**: AI assistance

---

## **How to Start**

Follow these steps to set up and run the project:

### **Backend Setup**
1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Create .env file with:
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key
   ```

3. Start the server:
   ```bash
   npm start
   ```

### **Frontend Setup**
1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

Access the application at `http://localhost:3000`

---

## **Use Case Scenario**

### **Scenario: Team Collaboration on Coding Problem**

1. **Actor**: Team Member
2. **Preconditions**: 
   - User is registered and logged in
   - User belongs to a team
   - Team has active coding session
3. **Steps**:
   1. User joins active coding session
   2. Views problem description and test cases
   3. Collaborates with team members through:
      - Synchronized code editing
      - Real-time chat
      - Voice communication
   4. Runs code against test cases
   5. Gets AI suggestions when needed
   6. Saves progress automatically
4. **Postconditions**:
   - Code changes are synchronized
   - Execution results are logged
   - Session progress is saved

---

## **Context Diagram**

### **Context Diagram for Team Collaboration**

```plaintext
  +-------------------+
  |                   |
  |       User        |
  |                   |
  +--------+----------+
           |
           | 1. Join Session
           v
  +--------+----------+
  |                   |
  |  Authentication   |
  |                   |
  +--------+----------+
           |
           | 2. Validate & Route
           v
  +--------+----------+
  |                   |
  | Coding Interface  |
  | - Editor          |
  | - Chat            |
  | - Voice           |
  +--------+----------+
           |
           | 3. Process Actions
           v
  +--------+----------+
  |                   |
  | Backend Services  |
  | - Code Execution  |
  | - Sync            |
  | - AI Assistant    |
  +--------+----------+
           |
           | 4. Store/Retrieve
           v
  +--------+----------+
  |                   |
  |    Database       |
  |                   |
  +-------------------+
```
