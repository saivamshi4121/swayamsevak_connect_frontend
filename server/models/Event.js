const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  type: { type: String },
  region: { type: String },
  isOpenToAll: { type: Boolean, default: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Event', EventSchema); 