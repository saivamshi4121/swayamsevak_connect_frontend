const Shakha = require('../models/Shakha');

// Create a new Shakha
exports.createShakha = async (req, res) => {
  try {
    const { name, location, region, category, schedule, visibility } = req.body;
    const shakha = await Shakha.create({
      name,
      location,
      region,
      category,
      schedule,
      visibility,
      organizer: req.user.id
    });
    const io = req.app.get('io');
    io.emit('shakha:created', shakha);
    res.status(201).json(shakha);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all Shakhas
exports.getAllShakhas = async (req, res) => {
  try {
    const shakhas = await Shakha.find().populate('organizer', 'name email');
    res.json(shakhas);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a single Shakha by ID
exports.getShakha = async (req, res) => {
  try {
    const shakha = await Shakha.findById(req.params.id).populate('organizer', 'name email');
    if (!shakha) return res.status(404).json({ msg: 'Shakha not found' });
    res.json(shakha);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update a Shakha by ID
exports.updateShakha = async (req, res) => {
  try {
    const shakha = await Shakha.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!shakha) return res.status(404).json({ msg: 'Shakha not found' });
    const io = req.app.get('io');
    io.emit('shakha:updated', shakha);
    res.json(shakha);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a Shakha by ID
exports.deleteShakha = async (req, res) => {
  try {
    const shakha = await Shakha.findByIdAndDelete(req.params.id);
    if (!shakha) return res.status(404).json({ msg: 'Shakha not found' });
    const io = req.app.get('io');
    io.emit('shakha:deleted', { _id: req.params.id });
    res.json({ msg: 'Shakha deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 