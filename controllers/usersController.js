const { db } = require('../config/database')

module.exports = {
    getData: (req, res) => {
        db.query(`Select * from users;`, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }

            res.status(200).send(results)
        })

    },
    register: (req, res) => {

    },
    login: (req, res) => {

    },
    updateData: (req, res) => {

    }
}