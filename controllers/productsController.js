const { db } = require("../config/database")

module.exports = {
    getProducts: (req, res) => {
        // 1. Ambil data dari table products
        // 2. Ambil data dari product_image
        // 3. looping results dari table products dan product image untuk digabungkan berdasarkan foreign key

        let sqlGetProducts = `Select * from products;`;
        let sqlGetProductImage = `Select * from product_image;`;
        db.query(sqlGetProducts, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }

            db.query(sqlGetProductImage, (err2, results2) => {
                if (err2) {
                    console.log(err2)
                    res.status(500).send(err2)
                }
                let newData = results.map((value, index) => {
                    value.images = [];
                    results2.forEach((item, idx) => {
                        if (value.idproduct == item.idproduct) {
                            value.images.push(item)
                        }
                    })
                    return value
                })

                console.log(newData)
                res.status(200).send(newData)
            })

        })
    }
}