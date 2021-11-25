const mysql = require('mysql');
const util = require('util')

const db = mysql.createPool({
    host: "localhost",
    user: 'AL',
    password: '007@001',
    database: "ecommerce",
    port: 3306
})

// mengaktifkan promise pada method db.query
const dbQuery = util.promisify(db.query).bind(db)

module.exports = { db, dbQuery }