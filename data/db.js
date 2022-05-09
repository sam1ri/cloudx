// server name = DESKTOP-UDJ81RL\MSSQLSERVER01
// db name = recepta

const {Sequelize} = require('sequelize');

const db = new Sequelize('recepta', 'Admin', 'Samiri123', {
    host: 'recepta.cvq5dyayy0fi.us-east-1.rds.amazonaws.com',
    loggin: console.log,
    dialect: 'mssql',
    port: 1433,
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 1000
    },
    define: {
        freezeTableName: true
    },
    logging: false 
});

db.authenticate()
.then(() => console.log("Database state: Connected "))
.catch(err => console.log(err))

module.exports = db;