// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Social_Media_Automation', 'root', 'shubham', {
    host: 'localhost', // Replace with your MySQL host
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: true, // Enable automatic timestamps createdAt and updatedAt
        underscored: true, // Use snake_case for automatically added attributes
        freezeTableName: true, // Prevent Sequelize from pluralizing table names
        // Define the primary key as 'id' and set autoIncrement to true
        primaryKey: 'id',
        autoIncrement: true,
    },
});

module.exports = sequelize;
