const Team = require("./team");
const User = require("./user");
const TeamMember = require("./TeamMember");
const Problem = require("./problems");

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

module.exports = {
  Team,
  User,
  TeamMember,
};
