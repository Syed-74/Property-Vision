const express = require("express");
const router = express.Router();
const { getAllPayments } = require("../controllers/payment.controller");

// GET all payments (rent records)
router.get("/", getAllPayments);

module.exports = router;
