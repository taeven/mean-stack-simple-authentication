const mongoose = require('mongoose');

const BadAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  count: { type: Number, required: true },
});

module.exports = mongoose.model('BadAttempt', BadAttemptSchema, 'badAttempts');
