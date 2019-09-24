const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseFormatter = require('../controllers/responseFormatter');
const User = require('../models/user.model');
const Session = require('../models/session.model');
const checkLogin = require('../middleware/chekLogin.middleware');
const verificationController = require('../controllers/verificationController');
const config = require('../config/config');

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

router.get('/login', checkLogin, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return responseFormatter.badReqResponse(res);

  return User.findOne({ email }, (err, user) => {
    if (err) return responseFormatter.internalErrorResponse(res);
    if (user && bcrypt.compareSync(password, user.password)) {
      const jwtToken = jwt.sign(JSON.stringify({ email }), config.jwtSecret);
      if (!user.isVerified)
        return responseFormatter.sendResponse(
          res,
          402,
          'email is not verified',
        );

      Session.findOneAndUpdate(
        { email },
        { jwt: jwtToken },
        { upsert: true },
        _err => {
          if (_err) responseFormatter.internalErrorResponse();
        },
      );

      return responseFormatter.sendResponse(
        res,
        200,
        {
          status: 'login success',
          user: user.email,
        },
        jwtToken,
      );
    }

    return responseFormatter.sendResponse(res, 200, 'authentication failed');
  });
});

router.get('/logout/:email', (req, res) => {
  const { email } = req.params;
  Session.findOneAndRemove({ email }, (err, doc) => {
    if (err) return responseFormatter.internalErrorResponse(res);
    if (!doc)
      return responseFormatter.sendResponse(res, 200, 'already logged out');

    return responseFormatter.sendResponse(res, 200, 'user logged out');
  });
});
module.exports = router;
