const responseFormatter = require('../controllers/responseFormatter');
const IP = require('../models/ip.model');
const errorHandler = require('../controllers/errorhandler');

function isIpAllowed(req, res, next) {
  const { ip } = req;
  IP.findOne({ ip, isBlacklisted: true }, (err, doc) => {
    errorHandler(err);
    if (doc) {
      return responseFormatter.sendResponse(res, 402, 'ip not allowed');
    }
    return next();
  });
}

module.exports = isIpAllowed;
