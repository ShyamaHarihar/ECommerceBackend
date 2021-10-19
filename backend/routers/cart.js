const router = require("express").Router();
const Cart = require('../models/Cart');
const { verifyToken, Verifytokenandauthorization, VerifyTokenAndAdmin } = require("./verifyToken")

//Create a product
/* 
POST /api/cart/add

*/
router.post("/add", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart)
    }
    catch (err) {
        res.status(500).json(err);
    }
});
/*
Update
PUT /api/cart/:id
*/
router.put("/:id", Verifytokenandauthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

/*
DELETE /api/cart/:id
*/
router.delete("/:id", Verifytokenandauthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
})


/* 
GET User Cart by id
*/
router.get("/find/:userId", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        //we do not want to send password so
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

router.get("/", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;