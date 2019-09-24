const mongoose = require('mongoose');

const IpSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  hostname: { type: String, required: true },
  isBlacklisted: { type: Boolean, default: false, required: false },
});

module.exports = mongoose.model('IP', IpSchema, 'ips');
