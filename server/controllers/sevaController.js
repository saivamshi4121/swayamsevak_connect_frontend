const SevaProject = require('../models/SevaProject');

// Create a new Seva Project
exports.createSeva = async (req, res) => {
  try {
    const { projectName, region, description, goals, metrics, volunteers, donations, status } = req.body;
    const seva = await SevaProject.create({
      projectName,
      region,
      description,
      goals,
      metrics,
      volunteers,
      donations,
      status
    });
    const io = req.app.get('io');
    io.emit('seva:created', seva);
    res.status(201).json(seva);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all Seva Projects
exports.getAllSevas = async (req, res) => {
  try {
    const sevas = await SevaProject.find().populate('volunteers', 'name email');
    res.json(sevas);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a single Seva Project by ID
exports.getSeva = async (req, res) => {
  try {
    const seva = await SevaProject.findById(req.params.id).populate('volunteers', 'name email');
    if (!seva) return res.status(404).json({ msg: 'Seva Project not found' });
    res.json(seva);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update a Seva Project by ID
exports.updateSeva = async (req, res) => {
  try {
    const seva = await SevaProject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!seva) return res.status(404).json({ msg: 'Seva Project not found' });
    const io = req.app.get('io');
    io.emit('seva:updated', seva);
    res.json(seva);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a Seva Project by ID
exports.deleteSeva = async (req, res) => {
  try {
    const seva = await SevaProject.findByIdAndDelete(req.params.id);
    if (!seva) return res.status(404).json({ msg: 'Seva Project not found' });
    const io = req.app.get('io');
    io.emit('seva:deleted', { _id: req.params.id });
    res.json({ msg: 'Seva Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 