const mysql = require('mysql');

const db = mysql.createPool({
    host: "localhost",
    user: 'AL',
    password: '007@001',
    database: "ecommerce",
    port: 3306
})

module.exports = { db }