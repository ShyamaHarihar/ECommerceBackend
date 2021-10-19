const router = require("express").Router();
const Order = require('../models/Order');
const { verifyToken, Verifytokenandauthorization, VerifyTokenAndAdmin } = require("./verifyToken")

//Create a product
/* 
POST /api/orders/add

*/
router.post("/add", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder)
    }
    catch (err) {
        res.status(500).json(err);
    }
});
/*
Update
PUT /api/orders/:id
*/
router.put("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

/*
DELETE /api/orders/:id
*/
router.delete("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
})


/* 
GET User Orders
*/
router.get("/find/:userId", Verifytokenandauthorization, async (req, res) => {
    try {
        const orders = await Order.findOne({ userId: req.params.userId })
        //we do not want to send password so
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

router.get("/", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.find();
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Advanced Function Get monthly income
router.get("/income", VerifyTokenAndAdmin, async (req, res) => {
    const date = new Date();//Sep
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))//Aug
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));//July
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: prevMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },

        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;