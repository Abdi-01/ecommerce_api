const { db, dbQuery } = require("../config/database");
const { uploader } = require("../config/multer");
const fs = require('fs');

module.exports = {
    getProducts: async (req, res) => {
        // 1. Ambil data dari table products
        // 2. Ambil data dari product_image
        // 3. looping results dari table products dan product image untuk digabungkan berdasarkan foreign key
        // CARA BEST PRACTICE MENGGUNAKAN PROMISIFY
        try {
            console.log(req.query.idproduct)
            let sqlGetProducts = `Select * from products ${req.query.idproduct ? `WHERE idproduct=${req.query.idproduct}` : ""};`;
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
    },
    addProduct: async (req, res) => {
        try {
            // console.log(req.body)
            const upload = uploader('/images', 'IMG').fields([{ name: 'images' }]);
            upload(req, res, async (error) => {
                try {
                    // Pengecekan
                    console.log(req.body.data);
                    console.log(req.files.images)
                    // Program sql
                    let { name, brand, category, stock, price, description, images } = JSON.parse(req.body.data);
                    const filePath = req.files.images ? `/images/${req.files.images[0].filename}` : null;

                    let sqlProduct = `INSERT INTO products values (null, '${name}', '${brand}', '${category}', '${description}', ${stock}, ${price}, 'ready');`

                    console.log("sqlScript products", sqlProduct);
                    console.log("sqlScript product_images", `INSERT INTO product_image values (null, , '${filePath}')`)
                    // let insertProduct = await dbQuery(sqlProduct);
                    // console.log(insertProduct.insertId)
                    // if (insertProduct.insertId) {
                    //     for (let i = 0; i < images.length; i++) {
                    //         await dbQuery(`INSERT INTO product_image values (null, ${insertProduct.insertId}, '${images[i]}')`)
                    //     }

                    //     res.status(200).send({ message: "Add product success ✅" })
                    // }
                } catch (error) {
                    fs.unlinkSync(`./public/images/${req.files.images[0].filename}`)
                    console.log(error);
                    res.status(500).send(error);
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            // console.log(req.params)
            let sqlProduct = `DELETE from products WHERE idproduct=${req.params.idproduct};`

            let getProductImage = `SELECT idproduct_image from product_image where idproduct=${req.params.idproduct};`

            await dbQuery(sqlProduct)

            getProductImage = await dbQuery(getProductImage);

            console.log(getProductImage)
            if (getProductImage.length > 0) {
                for (let i = 0; i < getProductImage.length; i++) {
                    await dbQuery(`DELETE from product_image WHERE idproduct_image=${getProductImage[i].idproduct_image};`)
                }
            }


            res.status(200).send({ message: "Delete product success ✅" })

        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    },
    updateProduct: async (req, res) => {
        try {
            console.log(req.body)
            let { idproduct, name, brand, category, stock, price, description, images } = req.body
            // 1. memperbarui data table products utama
            let resUpdate = await dbQuery(`UPDATE products set name=${db.escape(name)}, brand=${db.escape(brand)},
            category=${db.escape(category)},description=${db.escape(description)},stock=${db.escape(stock)},price=${db.escape(price)} 
            WHERE idproduct=${db.escape(idproduct)};`);

            // 2. memperbarui data table product_image
            images.forEach(async (value, index) => {
                await dbQuery(`UPDATE product_image set url=${db.escape(value.url)} 
                WHERE idproduct_image=${value.idproduct_image}`)
            })

            res.status(200).send({ message: "Update product success✅", success: true })

        } catch (error) {
            console.log(error)
        }
    }
}