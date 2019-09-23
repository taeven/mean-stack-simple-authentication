const express = require("express");
const bcrypt = require("bcrypt");
const formatResponse = require("../controllers/responseFormatter");
const User = require("../models/user.model");
const verificationController = require("../controllers/verificationController");
const router = express.Router();
router.post("/user", (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.password, 12);

    User.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            country: req.body.country,
            dob: req.body.dob,
            timezone: req.body.timezone
        },
        function(err, user) {
            response = {};
            if (err) {
                response.message = err.message;
                res.status(400);
            } else {
                verificationController.generateVerificationToken(user.email);
                response.message = `${user.email} registered successfullly`;
                res.status(200);
            }
            res = formatResponse(res, response);
            return res.send(res.response);
        }
    );
});

module.exports = router;
