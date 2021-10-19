const router = require("express").Router();
const { Verifytokenandauthorization, VerifyTokenAndAdmin } = require("./verifyToken")
const User = require('../models/User');
const CryptoJS = require("crypto-js")
const { SECRET_KEY } = require('../config/keys');


/*
Update
PUT /api/users/:id
*/
router.put("/:id", Verifytokenandauthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            SECRET_KEY
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});
/* 
DELETE
*/
router.delete("/:id", Verifytokenandauthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted");
    }
    catch (err) {
        res.status(500).json(err);
    }
})

/* 
GET USER  by id
*/
router.get("/find/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        //we do not want to send password so
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

/* GET ALL USERS by Admin
 GET api/users?new=true
 GET /api/users/
*/
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find();//find all users
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
})

/* 
GET api/users/stats
*/
router.get("/stats", VerifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));//last year
    try {
        const data = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month", total: { $sum: 1 }
                }
            }
        ]);// A complex query to match the records for each month and total
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }

});
module.exports = router;
