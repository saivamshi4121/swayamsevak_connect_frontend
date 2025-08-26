const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  tags: [{ type: String }],
  publishDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema); 