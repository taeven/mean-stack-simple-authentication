const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Session = require('../models/session.model');
const responseFormatter = require('../controllers/responseFormatter');

function checkLogin(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return next();
  }
  return jwt.verify(token, config.jwtSecret, (err, jwtContent) => {
    if (err) {
      res.locals.tokenError = 'Invalid token';
      next();
    }

    Session.findOne(
      { email: jwtContent.email, jwt: token },
      (_err, session) => {
        if (err) responseFormatter.internalErrorResponse(res);
        if (session)
          responseFormatter.sendResponse(res, 200, {
            user: session.email,
            status: 'already logged in',
          });
        else next();
      },
    );
  });
}

module.exports = checkLogin;
