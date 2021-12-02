const { db } = require('../config/database');
const Crypto = require('crypto');
const { createToken } = require("../config/token");

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
        let hashPassword = Crypto.createHmac("sha256", "key_password").update(req.body.password).digest("hex")
        let loginScript = `Select * from users WHERE email = '${req.body.email}' AND password = '${hashPassword}';`

        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            if (results.length > 0) {
                let { iduser, username, email, telp, role, status } = results[0]
                let token = createToken({ iduser, username, email, telp, role, status })
                console.log(token)

                res.status(200).send({
                    messages: "Login Success ✅", loginData: {
                        iduser,
                        username,
                        email,
                        telp,
                        role,
                        status,
                        token
                    }
                })
            } else {
                res.status(401).send({ messages: "User not found ❌" })
            }
        })
    },
    keepLogin: (req, res) => {
        console.log(req.dataUser)
        let loginScript = `Select * from users WHERE iduser=${req.dataUser.iduser} ;`

        db.query(loginScript, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }

            if (results.length > 0) {
                let { iduser, username, email, telp, role, status } = results[0];
                let token = createToken({ iduser, username, email, telp, role, status });
                res.status(200).send({
                    messages: "Login Success ✅", loginData: {
                        iduser,
                        username, 
                        email, 
                        telp, 
                        role, 
                        status,
                        token
                    }
                });
            } else {
                res.status(401).send({ messages: "User not found ❌" });
            }

        })
    },
    updateData: (req, res) => {

    }
}