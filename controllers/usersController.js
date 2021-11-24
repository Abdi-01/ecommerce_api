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
        (null,'${req.body.username}', '${req.body.email}', '${req.body.password}', 
        '${req.body.telp}', 'user', 'Unverified');`

        db.query(insertScript, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send({ messages: "Register success ✅", results })
        })
    },
    login: (req, res) => {
        let loginScript = `Select * from users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`

        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }

            res.status(200).send({ messages: "Login Success ✅", results })
        })
    },
    updateData: (req, res) => {

    }
}