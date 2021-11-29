const { db } = require('../config/database')
const Crypto = require('crypto')

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
        // enkripsi password/hashing password
        let hashPassword = Crypto.createHmac("sha256", "key_password").update(req.body.password).digest("hex")
        let insertScript = `INSERT INTO users values 
        (null,'${req.body.username}', '${req.body.email}', '${hashPassword}', 
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
        let hashPassword = Crypto.createHmac("sha256","key_password").update(req.body.password).digest("hex")
        let loginScript = `Select * from users WHERE email = '${req.body.email}' AND password = '${hashPassword}';`
        
        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }

            // delete results[0].password;

            console.log(loginScript)
            res.status(200).send({ messages: "Login Success ✅", results })
        })
    },
    keepLogin: (req, res) => {
        let loginScript = `Select * from users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`

        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }

            // delete results[0].password;

            res.status(200).send({ messages: "Login Success ✅", results })
        })
    },
    updateData: (req, res) => {

    }
}