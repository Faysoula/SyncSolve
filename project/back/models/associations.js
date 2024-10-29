const Team = require("./team");
const User = require("./user");
const TeamMember = require("./TeamMember");
const Problem = require("./problems");
const Session = require("./session");
const TerminalSession = require("./terminal_sessions");

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

module.exports = {
  Team,
  User,
  TeamMember,
  Problem,
  Session,
};
