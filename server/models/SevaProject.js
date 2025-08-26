const mongoose = require('mongoose');

const SevaProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  region: { type: String },
  description: { type: String },
  goals: { type: String },
  metrics: { type: String },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  donations: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Completed', 'Pending'], default: 'Active' }
});

module.exports = mongoose.model('SevaProject', SevaProjectSchema); 