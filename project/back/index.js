const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const initializeSocket = require("./utils/socket");
const http = require("http");
const { testConnection } = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
require("dotenv").config();

const {
  Team,
  User,
  TeamMember,
  Problem,
  Session,
  TerminalSession,
  SessionSnapshot,
  Execution,
} = require("./models/associations");

// Routes
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemsRoutes");
const teamRoutes = require("./routes/teamRoute");
const teamMemberRoutes = require("./routes/teamMembersRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const terminalRoutes = require("./routes/terminalRoutes");
const sessionSnapshot = require("./routes/sessionSnapRoutes");
const ExecutionRoutes = require("./routes/executionRoutes");
const uploadRoutes = require("./routes/uploadRoute");
const chatRoutes = require("./routes/chatRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Initialize express
const app = express();

// Initialize server
const server = http.createServer(app);

// Initialize socket
initializeSocket(server);

// Port
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/snapshots", sessionSnapshot);
app.use("/api/executions", ExecutionRoutes);
app.use("/api", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("api running yay");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(PORT,() => {
  console.log(`====================================`);
  console.log(`Server running on port ${PORT}`);
  testConnection();
  console.log(`====================================`);
});
