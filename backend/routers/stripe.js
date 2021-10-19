const router = require("express").Router();
const { STRIPE_KEY } = require('../config/keys');
const stripe = require("stripe")(STRIPE_KEY);
router.post("/payment", (req, res) => {
    stripe.charges.create(
        {
            source: "tok_us",//req.body.tokenId
            amount: req.body.amount,
            currency: "INR",
            description: "some shit",


        }, (stripeErr, stripeRes) => {
            if (stripeErr) {
                console.log(stripeErr);
                res.status(500).json(stripeErr);
            }
            else {
                res.status(200).json(stripeRes);
            }
        })
})
module.exports = router;