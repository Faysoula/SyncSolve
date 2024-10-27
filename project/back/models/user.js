const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const Problem = require("./problems");

const User = db.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },

  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
 }, {
    tableName: "users",
    timestamps: false,//alr have them in the columns
});

User.hasMany(Problem, {
  foreignKey: 'created_by',
  onDelete: 'SET NULL',
});

module.exports = User;