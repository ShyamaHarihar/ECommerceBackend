const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const { SECRET_KEY, JWT_SIGN } = require('../config/keys');
const jwt = require('jsonwebtoken')
//REGISTER
/*
    POST /api/auth/register
    Encrypt the password using CryptoJS
*/
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password, SECRET_KEY),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN
/*
    POST /api/auth/login 
*/
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong credentials");
        const hashedpassword = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
        const OriginalPassword = hashedpassword.toString(CryptoJS.enc.Utf8);
        OriginalPassword != req.body.password && res.status(401).json("Wrong credentials");
        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SIGN, { expiresIn: "2d" });
        const { password, ...others } = user._doc;//little weird if we don't write _doc then the output is weird that's how mongoDB works
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);

    }
})
module.exports = router;