const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Execution = db.define(
  "Execution",
  {
    execution_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      validate: {
        isIn: [["success", "failure", "error"]],
      },
    },
    executed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    terminal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "executions",
    timestamps: false,
  }
);

module.exports = Execution;
