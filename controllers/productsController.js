const { db, dbQuery } = require("../config/database")

module.exports = {
    getProducts: async (req, res) => {
        // 1. Ambil data dari table products
        // 2. Ambil data dari product_image
        // 3. looping results dari table products dan product image untuk digabungkan berdasarkan foreign key
        try {
            let sqlGetProducts = `Select * from products;`;
            let sqlGetProductImage = `Select * from product_image;`;

            let getProducts = await dbQuery(sqlGetProducts);
            let getProductImage = await dbQuery(sqlGetProductImage);

            let newData = getProducts.map((value, index) => {
                value.images = [];
                getProductImage.forEach((val, idx) => {
                    if (value.idproduct == val.idproduct) {
                        value.images.push(val)
                    }
                });

                return value;
            })

            res.status(200).send(newData)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }

        //    CARA STANDART
        // db.query(sqlGetProducts, (err, results) => {
        //     if (err) {
        //         console.log(err)
        //         res.status(500).send(err)
        //     }

        //     db.query(sqlGetProductImage, (err2, results2) => {
        //         if (err2) {
        //             console.log(err2)
        //             res.status(500).send(err2)
        //         }
        //         let newData = results.map((value, index) => {
        //             value.images = [];
        //             results2.forEach((item, idx) => {
        //                 if (value.idproduct == item.idproduct) {
        //                     value.images.push(item)
        //                 }
        //             })
        //             return value
        //         })

        //         console.log(newData)
        //         res.status(200).send(newData)
        //     })

        // })
    }
}