const Sequelize = require('sequelize');
const db = require('../data/db');

const Users = db.define('Users',{
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING
    },
    LastName: {
        type: Sequelize.STRING
    },
    UserName: {
        type: Sequelize.STRING
    },
    Password: {
        type: Sequelize.STRING
    },
    IsActive: {
        type: Sequelize.BOOLEAN
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    }

}, {
    timestamps: false
})

module.exports = Users;