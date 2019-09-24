/* eslint-disable no-shadow */
const express = require('express');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const responseFormatter = require('../controllers/responseFormatter');
const verificationController = require('../controllers/verificationController');

const router = express.Router();

router.get('/:email/:key', (req, res) => {
  const { email, key } = req.params;

  User.findOne({ email, isVerified: false }, (_err, user) => {
    if (!user) {
      return responseFormatter.sendResponse(res, 400, 'bad request');
    }
    Token.findOne(
      {
        email,
        created_at: {
          $lt: new Date(),
          $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
      (_err, token) => {
        if (!token) {
          if (verificationController.generateVerificationToken(email))
            return responseFormatter.sendResponse(
              res,
              200,
              'token expired, regenerated ',
            );
          return responseFormatter.internalErrorResponse(res);
        }
        if (token.key === key) {
          User.findOneAndUpdate({ email }, { isVerified: true }, _err => {
            return _err ? responseFormatter.internalErrorResponse(res) : true;
          });
          Token.findOneAndDelete({ email }, _err => {
            return _err ? responseFormatter.internalErrorResponse(res) : true;
          });
          return responseFormatter.sendResponse(
            res,
            200,
            `${token.email} is verified`,
          );
        }
        return responseFormatter.sendResponse(res, 400, 'bad request');
      },
    );
    return true;
  });
});

module.exports = router;
