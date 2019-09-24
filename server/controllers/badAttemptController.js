const BadAttempt = require('../models/badAttempt.model');
const User = require('../models/user.model');
const errorhandler = require('../controllers/errorhandler');

function handleBadAttempt(email) {
  BadAttempt.findOne({ email }, (err, doc) => {
    if (!doc) {
      return BadAttempt.create({ email, count: 1 }, errorhandler);
    }
    if (doc.count >= 4) {
      return User.findOneAndUpdate(
        { email },
        {
          isLocked: true,
          lockedTill: new Date(new Date().setHours(new Date().getHours() + 2)),
        },
        errorhandler,
      );
    }
    return BadAttempt.updateOne(
      { email },
      { count: doc.count + 1 },
      errorhandler,
    );
  });
}

function clearBadAttempts(email) {
  BadAttempt.findOneAndDelete({ email }, errorhandler);
  User.findOneAndUpdate({ email }, { isLocked: false }, errorhandler);
}

module.exports = { handleBadAttempt, clearBadAttempts };
