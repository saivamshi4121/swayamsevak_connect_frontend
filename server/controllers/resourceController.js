const Resource = require('../models/Resource');

// Create a new Resource
exports.createResource = async (req, res) => {
  try {
    const { title, type, fileUrl, category, tags, publishDate } = req.body;
    const resource = await Resource.create({
      title,
      type,
      fileUrl,
      category,
      tags,
      publishDate,
      uploadedBy: req.user.id
    });
    const io = req.app.get('io');
    io.emit('resource:created', resource);
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all Resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name email');
    res.json(resources);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a single Resource by ID
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!resource) return res.status(404).json({ msg: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update a Resource by ID
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!resource) return res.status(404).json({ msg: 'Resource not found' });
    const io = req.app.get('io');
    io.emit('resource:updated', resource);
    res.json(resource);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a Resource by ID
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ msg: 'Resource not found' });
    const io = req.app.get('io');
    io.emit('resource:deleted', { _id: req.params.id });
    res.json({ msg: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 