const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        console.log("DB_NAME:", process.env.DB_NAME);
        console.log("DB_USER:", process.env.DB_USER);
        console.log("DB_PASS:", process.env.DB_PASS); 
        console.log("DB_HOST:", process.env.DB_HOST);
        console.log("DB_PORT:", process.env.DB_PORT);
        console.log("DB_DIALECT:", process.env.DB_DIALECT);
    }
}

module.exports = { db, testConnection };