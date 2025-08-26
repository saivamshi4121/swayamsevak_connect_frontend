const Event = require('../models/Event');

// Create a new Event
exports.createEvent = async (req, res) => {
  try {
    const { eventName, description, date, type, region, participants } = req.body;
    const event = await Event.create({
      eventName,
      description,
      date,
      type,
      region,
      participants,
      createdBy: req.user.id
    });
    const io = req.app.get('io');
    io.emit('event:created', event);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('participants', 'name email').populate('createdBy', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a single Event by ID
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'name email').populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update an Event by ID
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    const io = req.app.get('io');
    io.emit('event:updated', event);
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete an Event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    const io = req.app.get('io');
    io.emit('event:deleted', { _id: req.params.id });
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Mark user as interested in event
exports.addInterest = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { participants: req.user.id } },
      { new: true }
    ).populate('participants', 'name email');
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    const io = req.app.get('io');
    io.emit('event:interest', event);
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
// Mark user as not interested
exports.removeInterest = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $pull: { participants: req.user.id } },
      { new: true }
    ).populate('participants', 'name email');
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    const io = req.app.get('io');
    io.emit('event:interest', event);
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}; 