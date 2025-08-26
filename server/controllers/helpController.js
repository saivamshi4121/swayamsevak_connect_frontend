const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');

// User submits a help request
exports.createHelp = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: 'Message required' });
    const help = await HelpRequest.create({ user: req.user.id, message });
    res.status(201).json(help);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Admin: get all help requests
exports.getAllHelp = async (req, res) => {
  try {
    const help = await HelpRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(help);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Admin: respond to a help request
exports.respondHelp = async (req, res) => {
  try {
    const { response, status } = req.body;
    const help = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { response, status: status || 'closed' } },
      { new: true }
    );
    if (!help) return res.status(404).json({ msg: 'Help request not found' });
    res.json(help);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Admin: delete a help request
exports.deleteHelp = async (req, res) => {
  try {
    const help = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!help) return res.status(404).json({ msg: 'Help request not found' });
    res.json({ msg: 'Help request deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 