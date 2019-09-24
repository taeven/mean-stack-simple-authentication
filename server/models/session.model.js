const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  jwt: { type: String, required: true },
});

module.exports = mongoose.model('Session', SessionSchema, 'sessions');
