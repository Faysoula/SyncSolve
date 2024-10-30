const { DataTypes } = require('sequelize');
const {db} = require('../config/db');

const SessionSnapshot = db.define("session_snapshots"  {
    snapshot_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    code_snapshot: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    }, {
    tableName: "session_snapshots",
    timestamps: false,
})

module.exports = SessionSnapshot;