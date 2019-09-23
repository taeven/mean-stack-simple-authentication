const express = require("express");
const router = express.Router();

router.get("/health-check", (req, res) => res.send("OK"));

const userRoutes = require("./auth.route");
router.use("/auth", userRoutes);

module.exports = router;
