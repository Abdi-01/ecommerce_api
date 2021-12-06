const { db, dbQuery } = require('../config/database');
const Crypto = require('crypto');
const { createToken } = require("../config/token");
const { transporter } = require("../config/nodemailer")

module.exports = {
    getData: (req, res) => {
        db.query(`Select * from users;`, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }

            res.status(200).send(results)
        })
    },
    register: async (req, res) => {
        try {
            // enkripsi password/hashing password
            let hashPassword = Crypto.createHmac("sha256", "key_password").update(req.body.password).digest("hex")
            let insertScript = `INSERT INTO users values (null,'${req.body.username}', '${req.body.email}', '${hashPassword}', '${req.body.telp}', 'user', 'Unverified');`

            let insertSQL = await dbQuery(insertScript);

            let results = await dbQuery(`Select * from users where iduser = ${insertSQL.insertId};`);
            if (results.length > 0) {
                let { iduser, username, email, telp, role, status } = results[0];
                let token = createToken({ iduser, username, email, telp, role, status });

                // konfigurasi email
                await transporter.sendMail({
                    from: `Admin Ecommerce API`,
                    to: process.env.EMAIL_TUJUAN,
                    subject: "Konfirmasi Register",
                    html: `<div>
                    <h4>Berikut link verifikasi email anda</h4>
                    <a href='http://localhost:3000/verification/${token}'>Klik, Verifikasi Email</a>
                    </div>`
                })
                res.status(200).send({ messages: "Register success ✅", success: true })
            } else {
                res.status(500).send({ messages: "Register failed ❌" })
            }

        } catch (error) {
            console.log(err)
            res.status(500).send(err)
        }
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
    accountVerification: async (req, res) => {
        try {
            console.log("Output Token", req.dataUser)
            let updateScript = `UPDATE users set status='Verified' WHERE iduser=${req.dataUser.iduser};`

            let updateSQL = await dbQuery(updateScript);

            res.status(200).send({ message: "Account Verified ✅", success: true })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}