module.exports = {
    name: "Production Server",
    PORT: process.env.PORT,
    JWT_SIGN: "shyama",
    SECRET_KEY: "shyamaisawesome",
    MONGOURI: "mongodb+srv://user:user@cluster0.wteyw.mongodb.net/shop?retryWrites=true&w=majority"
};