const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseFormatter = require('../controllers/responseFormatter');
const User = require('../models/user.model');
const Session = require('../models/session.model');
const checkLogin = require('../middleware/checkLogin.middleware');
const verificationController = require('../controllers/verificationController');
const {
  handleBadAttempt,
  clearBadAttempts,
} = require('../controllers/badAttemptController');
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

router.post('/login', checkLogin, (req, res) => {
  const { email, password } = req.body;
  const { ip, hostname } = req;

  if (!email || !password) return responseFormatter.badReqResponse(res);

  return User.findOne({ email }, (err, user) => {
    if (err) return responseFormatter.internalErrorResponse(res);

    // password matches
    if (user && bcrypt.compareSync(password, user.password)) {
      // check if account is still locked
      if (user.isLocked && new Date(user.lockedTill) > Date.now()) {
        return responseFormatter.sendResponse(
          res,
          402,
          'account is locked for 2 hrs',
        );
      }

      // check if the email is verified
      if (!user.isVerified)
        return responseFormatter.sendResponse(
          res,
          402,
          'email is not verified',
        );

      // store jwt for session management
      const jwtToken = jwt.sign(JSON.stringify({ email }), config.jwtSecret);
      Session.findOneAndUpdate(
        { email },
        { jwt: jwtToken },
        { upsert: true },
        _err => {
          if (_err) responseFormatter.internalErrorResponse();
        },
      );
      // clear bad attempt count
      clearBadAttempts(email);
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

    // password doesnt match or user doesn't exist
    handleBadAttempt(email, ip, hostname);
    return responseFormatter.sendResponse(res, 200, 'authentication failed');
  });
});

router.get('/logout', (req, res) => {
  const { token } = req.cookies;
  Session.findOneAndRemove({ jwt: token }, (err, doc) => {
    if (err) return responseFormatter.internalErrorResponse(res);
    if (!doc)
      return responseFormatter.sendResponse(res, 200, 'already logged out');

    return responseFormatter.sendResponse(res, 200, 'user logged out');
  });
});

router.get('/me', checkLogin, (req, res) => {
  return responseFormatter.sendResponse(res, 200, 'not logged in');
});
module.exports = router;
