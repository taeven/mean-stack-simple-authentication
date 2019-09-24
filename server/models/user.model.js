const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  dob: { type: Date },
  timezone: { type: String },
  email: {
    type: String,
    required: true,
    index: { unique: true },
    match: [
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email',
    ],
  },
  jwt: { type: String, required: false },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false, required: false },
});

UserSchema.plugin(uniqueValidator, { message: 'Email already exists' });

module.exports = mongoose.model('User', UserSchema, 'users');
