const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HelpRequest', HelpRequestSchema); 