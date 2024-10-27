const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const Team = require("./team");
const User = require("./user");

const TeamMember = db.define(
  "TeamMember",
  {
    team_member_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      validate: {
        isIn: [["member", "admin"]],
      },
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "team_members",
    timestamps: false,
  }
);

TeamMember.belongsTo(Team, { foreignKey: "team_id" });
TeamMember.belongsTo(User, { foreignKey: "user_id" });

module.exports = TeamMember;
