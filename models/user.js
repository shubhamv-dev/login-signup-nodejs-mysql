// models/user.js
const { DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

const validRoles = ['super admin', 'manager', 'sales team', 'customer support', 'content team'];

// Make sure to receive the `sequelize` instance as a parameter
module.exports = (sequelize) => {
    const User = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'customer support', // Default role is 'customer support'
            validate: {
              isIn: [validRoles], // Ensure the role is one of the valid roles
            },
          },
    });

    // Hash the password before creating a new user
    // User.beforeCreate(async (user) => {
    //     const hashedPassword = await bcrypt.hash(user.password, 10);
    //     user.password = hashedPassword;
    // });

    return User;
};
