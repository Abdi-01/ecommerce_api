const express = require('express');
const app = express();
const PORT = 2025;
const cors = require('cors');
const bearerToken = require("express-bearer-token")
const dotenv = require("dotenv");
dotenv.config()

app.use(bearerToken());// untuk mengambil data token dari request header client
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Memeriksa koneksi backend dengan mysql server
const { db } = require('./config/database')

db.getConnection((err, connection) => {
    if (err) {
        console.log(`Error MySQL Connection`, err.message)
    }
    console.log(`Connected to MySQL Server : ${connection.threadId}`)
})


app.get('/', (req, res) => {
    res.status(200).send(`<h2>Welcome to Ecommerce API</h2>`)
})


// Konfigurasi routing
const { usersRouter, productsRouter, transactionsRouter } = require('./routers')

app.use("/users", usersRouter)
app.use("/products", productsRouter)
app.use("/transactions", transactionsRouter)

app.listen(PORT, () => console.log('Eccommerce API RUNNING :', PORT))