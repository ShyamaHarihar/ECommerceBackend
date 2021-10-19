const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config/keys");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SIGN, (err, user) => {
            if (err) res.status(403).json("token is not valid!");
            req.user = user;
            next();//continue running the function
        })
    }
    else {
        return res.status(401).json("You are not authenticated!");
    }
}
const Verifytokenandauthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

const VerifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
module.exports = {
    verifyToken,
    Verifytokenandauthorization,
    VerifyTokenAndAdmin
};