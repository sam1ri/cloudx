const Sequelize = require('sequelize');
const db = require('../data/db');

const Recipes = db.define('Recipes',{
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING
    },
    ContentText: {
        type: Sequelize.STRING
    },
    ImageBase64Info: {
        type: Sequelize.STRING
    },
    ImageUrl: {
        type: Sequelize.STRING
    },
    UploadedBy: {
        type: Sequelize.INTEGER
    },
    IsDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
})

module.exports = Recipes;