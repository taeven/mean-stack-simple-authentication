const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config');
const Session = require('../models/session.model');
const responseFormatter = require('../controllers/responseFormatter');

function checkLogin(req, res, next) {
  const { token } = req.cookies;

  jwt.verify(token, config.jwtSecret, (err, jwtContent) => {
    if (err) {
      res.locals.tokenError = 'Invalid token';
      return next();
    }

    Session.findOne(
      { email: jwtContent.email, jwt: token },
      (_err, session) => {
        if (err) responseFormatter.internalErrorResponse(res);
        if (session)
          responseFormatter.sendResponse(res, 200, {
            email: session.email,
            status: 'already logged in',
          });
        else next();
      },
    );
  });
}

module.exports = checkLogin;
