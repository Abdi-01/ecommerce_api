const express = require('express'); // module yang digunakan untuk konfigurasi back-end
const app = express();
const cors = require('cors'); // digunakan untuk mengelola hak akses siapa saja user yang dpat mengakses backend
const bearerToken = require("express-bearer-token"); // mengambil token dari request header
const dotenv = require("dotenv"); // untuk mengamankan value konfigurasi middleware pada environtment
dotenv.config(); // menjalankan dotenv 
const PORT = process.env.PORT;

app.use(bearerToken());// untuk mengambil data token dari request header client
app.use(cors());
app.use(express.json()); // untuk mengambil data dari req.body
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