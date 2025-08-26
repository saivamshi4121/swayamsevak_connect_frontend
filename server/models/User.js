const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  number: { type: String, required: true },
  age: { type: Number, required: true },
  designation: { type: String, required: true },
  shakha: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
