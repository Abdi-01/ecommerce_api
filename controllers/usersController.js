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
        let insertScript = `INSERT INTO users values 
        (null,'${req.body.username}', '${req.body.email}', 
        '${req.body.telp}', '${req.body.role}', '${req.body.status}',${req.body.usia}, 0);`

        db.query(insertScript, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send({ messages: "Register success ✅", results })
        })
    },
    login: (req, res) => {

    },
    updateData: (req, res) => {

    }
}