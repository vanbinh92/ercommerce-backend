const express = require("express");
const cors = require("cors");

const accountRouter = require("./routers/account.router");
const userRouter = require("./routers/user.router");
const categoryRouter = require("./routers/category.router");
const manufactureRouter = require("./routers/manufacture.router");
const productRouter = require("./routers/product.router");
const orderRouter = require("./routers/order.router");
const orderDetailRouter = require("./routers/orderDetail.router");
const CartRouter = require("./routers/cart.router");
const PaymentRouter = require("./routers/payment.router");
const StripeRouter = require("./routers/stripe.router");
const ReviewRouter = require("./routers/review.router");
const authRouter = require("./routers/auth.router");

const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.static("public/images"));
// app.use("public/image", express.static(__dirname + "public/image"));
app.use("/account", accountRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/manufacture", manufactureRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/orderDetail", orderDetailRouter);
app.use("/cart", CartRouter);
app.use("/review", ReviewRouter);
app.use("/payment", PaymentRouter);
app.use("/api/stripe", StripeRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json("ok");
});

// get PORT from file .env, if novalue will get port = 3000
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}...`);
});
