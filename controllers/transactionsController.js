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
    }
}