const express = require('express');
const bcrypt = require('bcrypt');
const responseFormatter = require('../controllers/responseFormatter');
const User = require('../models/user.model');
const verificationController = require('../controllers/verificationController');

const router = express.Router();
router.post('/user', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 12);

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      country: req.body.country,
      dob: req.body.dob,
      timezone: req.body.timezone,
    },
    (err, user) => {
      if (err) {
        responseFormatter.sendResponse(res, 400, err.message);
      } else {
        verificationController.generateVerificationToken(user.email);
        responseFormatter.sendResponse(
          res,
          200,
          `${user.email} registered successfullly`,
        );
      }
    },
  );
});

module.exports = router;
