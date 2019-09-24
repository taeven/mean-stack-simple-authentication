const express = require('express');
const bcrypt = require('bcrypt');
const responseFormatter = require('../controllers/responseFormatter');
const User = require('../models/user.model');
const verificationController = require('../controllers/verificationController');

const router = express.Router();
router.post('/user', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 12);
  const { name, email, country, dob, timezone } = req.body;

  User.create(
    {
      name,
      email,
      password: hashedPassword,
      country,
      dob,
      timezone,
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

router.get('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return responseFormatter.badReqResponse(res);

  return User.findOne({ email }, (err, user) => {
    if (err) return responseFormatter.internalErrorResponse(res);
    if (user && bcrypt.compareSync(password, user.password))
      return responseFormatter.sendResponse(res, 200, {
        status: 'login success',
        user: user.email,
      });

    return responseFormatter.sendResponse(res, 200, 'authentication failed');
  });
});

module.exports = router;
