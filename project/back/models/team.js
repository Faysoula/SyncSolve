const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const TeamMember = require("./TeamMember");
const User = require("./user");

const Team = db.define(
  "Team",
  {
    team_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    team_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "teams",
    timestamps: false,
  }
);

Team.hasMany(TeamMember, { foreignKey: "team_id", onDelete: "CASCADE" });

Team.belongsToMany(User, {
  through: TeamMember,
  foreignKey: "team_id",
  otherKey: "user_id",
});

module.exports = Team;
