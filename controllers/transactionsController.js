const { db, dbQuery } = require("../config/database")

module.exports = {
    getCart: async (req, res) => {
        try {
            let selectCart = `Select c.*, p.name, p.price, pi.url as url_image from cart c
            JOIN products p on c.idproduct = p.idproduct
            JOIN users u on c.iduser = u.iduser 
            JOIN product_image pi on p.idproduct = pi.idproduct GROUP BY c.idcart;`

            selectCart = await dbQuery(selectCart);

            res.status(200).send(selectCart)

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addCart: async (req, res) => {
        try {
            let insertCart = `INSERT INTO cart values (null, ${db.escape(req.body.idproduct)}, 
            ${db.escape(req.body.iduser)}, ${db.escape(req.body.qty)});`

            insertCart = await dbQuery(insertCart)

            if (insertCart.insertId) {
                res.status(200).send({ message: "Add to cart success ✅", success: true })
            }

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}