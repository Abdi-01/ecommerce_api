const express = require("express")
const { transactionsController } = require("../controllers")
const router = express.Router();

router.get("/get-cart", transactionsController.getCart);

module.exports = router;