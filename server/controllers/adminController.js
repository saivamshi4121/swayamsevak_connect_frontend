const User = require('../models/User');
const Shakha = require('../models/Shakha');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const SevaProject = require('../models/SevaProject');

exports.getStats = async (req, res) => {
  try {
    const [users, shakhas, events, resources, seva] = await Promise.all([
      User.countDocuments(),
      Shakha.countDocuments(),
      Event.countDocuments(),
      Resource.countDocuments(),
      SevaProject.countDocuments(),
    ]);
    res.json({ users, shakhas, events, resources, seva });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch stats', error: err.message });
  }
}; 