const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { PORT, name, MONGOURI } = require("./config/keys");


const userRoute = require('./routers/user');
const authRoute = require('./routers/auth');
const prodRoute = require('./routers/product');
const cartRoute = require('./routers/cart');
const orderRoute = require('./routers/order');
mongoose.connect(MONGOURI)
    .then(() => console.log("Database connection successfull")).catch(() =>
        (err) => console.log(err))
//app.get("/api/test", () => console.log("Test is successfull"))


app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.listen(PORT, () => {
    console.log(`App is running at ${PORT} in ${name}`);
});