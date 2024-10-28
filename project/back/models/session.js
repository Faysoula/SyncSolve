const { DataTypes } = require('sequelize');
const {db} = require('../config/db');


const Session = db.define("Session", {
    session_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    team_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    problem_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    started_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ended_at:{
        type: DataTypes.DATE,
        allowNull: true,
    },
},
    {
        tableName: 'sessions',
        timestamps: false,
    }
);

module.exports = Session;