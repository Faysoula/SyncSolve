const Team = require("./team");
const User = require("./user");
const TeamMember = require("./TeamMember");
const Problem = require("./problems");
const Session = require("./session");
const TerminalSession = require("./terminal_sessions");
const SessionSnapshot = require("./sessionSnapshots");
const Execution = require("./executions");
const Chat = require("./Chat");

// Set up associations
Team.hasMany(TeamMember, { foreignKey: "team_id", onDelete: "CASCADE" });
TeamMember.belongsTo(Team, { foreignKey: "team_id", onDelete: "CASCADE" });

User.hasMany(TeamMember, { foreignKey: "user_id", onDelete: "CASCADE" });
TeamMember.belongsTo(User, { foreignKey: "user_id" });

Team.belongsToMany(User, {
  through: TeamMember,
  foreignKey: "team_id",
  otherKey: "user_id",
});

User.belongsToMany(Team, {
  through: TeamMember,
  foreignKey: "user_id",
  otherKey: "team_id",
});

User.hasMany(Problem, {
  foreignKey: "created_by",
  onDelete: "SET NULL",
});

Problem.hasMany(Session, {
  foreignKey: "problem_id",
  onDelete: "CASCADE",
});
Session.belongsTo(Problem, {
  foreignKey: "problem_id",
});

// Team has many Sessions
Team.hasMany(Session, {
  foreignKey: "team_id",
  onDelete: "CASCADE",
});
Session.belongsTo(Team, {
  foreignKey: "team_id",
});

Session.hasMany(TerminalSession, {
  foreignKey: "session_id",
  onDelete: "CASCADE",
});
TerminalSession.belongsTo(Session, {
  foreignKey: "session_id",
});

Session.hasMany(SessionSnapshot, {
  foreignKey: "session_id",
  onDelete: "CASCADE",
});

SessionSnapshot.belongsTo(Session, {
  foreignKey: "session_id",
  onDelete: "CASCADE",
});

// Execution belongs to User
User.hasMany(Execution, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});
Execution.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

// Execution belongs to TerminalSession
TerminalSession.hasMany(Execution, {
  foreignKey: "terminal_id",
  onDelete: "SET NULL", 
});
Execution.belongsTo(TerminalSession, {
  foreignKey: "terminal_id",
  onDelete: "SET NULL",
});

Team.hasMany(Chat, {
  foreignKey: "team_id",
  onDelete: "CASCADE",
});

Chat.belongsTo(Team, {
  foreignKey: "team_id",
});

User.hasMany(Chat, {
  foreignKey: "sender_id",
  onDelete: "SET NULL",
});

Chat.belongsTo(User, {
  foreignKey: "sender_id",
});

module.exports = {
  Team,
  User,
  TeamMember,
  Problem,
  Session,
  TerminalSession,
  SessionSnapshot,
  Execution,
};
