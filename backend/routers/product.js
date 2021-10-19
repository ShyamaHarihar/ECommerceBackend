const router = require("express").Router();
const Product = require('../models/Product');
const { VerifyTokenAndAdmin } = require("./verifyToken")

//Create a product
/* 
POST /api/products/add

*/
router.post("/add", VerifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct)
    }
    catch (err) {
        res.status(500).json(err);
    }
});
/*
Update
PUT /api/products/:id
*/
router.put("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

/*
DELETE /api/products/:id
*/
router.delete("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
})


/* 
GET Product  by id
*/
router.get("/find/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        //we do not want to send password so
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

/* GET ALL Products by Admin
GET /api/products/?category=women
GET /api/products/?new=true
*/
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        }
        else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        }
        else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;