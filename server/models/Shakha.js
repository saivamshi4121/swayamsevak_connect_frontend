const mongoose = require('mongoose');

const ShakhaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mapsLink: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  region: { type: String, required: true },
  category: { type: String, required: true },
  schedule: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: Boolean, default: true }
});

module.exports = mongoose.model('Shakha', ShakhaSchema); 