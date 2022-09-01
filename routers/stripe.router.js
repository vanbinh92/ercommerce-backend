const { webhook,createCheckout } = require("../controllers/stripe.controller");
const express = require("express");
const bodyParser = require("body-parser");

const router = require("express").Router();
router.post("/create-checkout-seasion", createCheckout);
router.post("/webhook",express.raw({type: 'application/json'}),webhook);


module.exports = router;
