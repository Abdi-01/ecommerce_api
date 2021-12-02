const express = require("express");
const { readToken } = require("../config/token");
const { transactionsController } = require("../controllers")
const router = express.Router();

router.get("/get-cart", readToken, transactionsController.getCart);
router.post("/add-cart", transactionsController.addCart)

module.exports = router;