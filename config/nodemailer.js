const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "emailPengirim@gmail.com",
        pass: "passwordSandiAplikasi"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = { transporter }