const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Problems = db.define("Problems", {
  problem_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.STRING(10),
    validate: {
      isIn: [["easy", "medium", "hard"]],
    },
  },
  created_by:{
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id'
    },
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  test_cases: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      tags: [],
      is_daily: false,
      example_images: []
    },
  }
}, {
    tableName: "problems",
    timestamps: false,
});

module.exports = Problems;

