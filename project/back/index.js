const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { testConnection } = require("./config/db");
require("dotenv").config();

const {
  Team,
  User,
  TeamMember,
  Problem,
  Session,
  TerminalSession,
  SessionSnapshot,
} = require("./models/associations");

const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemsRoutes");
const teamRoutes = require("./routes/teamRoute");
const teamMemberRoutes = require("./routes/teamMembersRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const terminalRoutes = require("./routes/terminalRoutes");
const sessionSnapshot = require("./routes/sessionSnapRoutes");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/snapshots", sessionSnapshot);

app.get("/", (req, res) => {
  res.send("api running yay");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`Server running on port ${PORT}`);
  testConnection();
  console.log(`====================================`);
});
