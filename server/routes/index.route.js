const express = require("express");
const router = express.Router();

router.get("/health-check", (req, res) => res.send("OK"));

const userRoutes = require("./auth.route");
const verificationRoutes = require("./verification.route");
router.use("/auth", userRoutes);
router.use("/verify", verificationRoutes);
module.exports = router;
