const express = require("express");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const verificationController = require("../controllers/verificationController");
const router = express.Router();

router.get("/:email/:key", (req, res) => {
    email = req.params.email;
    key = req.params.key;

    User.findOne({ email, isVerified: false }, (err, user) => {
        if (!user) {
            return res.status(400).send("bad request");
        }
        Token.findOne({ email }, (err, token) => {
            if (!token) {
                if (verificationController.generateVerificationToken(email))
                    return res.status(200).send("token expired, regenerated ");
                else return res.status(500).send("internal error occurred");
            } else if (token.key == key) {
                user.isVerified = true;
                User.findOneAndUpdate(
                    { email },
                    { isVerified: true },
                    (err, token) => {}
                );
                Token.findOneAndDelete({ email }, (err, token) => {});

                return res.status(200).send("done");
            } else return res.status(400).send("bad request");
        });
    });
});

module.exports = router;
