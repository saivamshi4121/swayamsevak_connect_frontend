const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create default admin if not exists
async function ensureDefaultAdmin() {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@swayam.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Default Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      number: '9999999999',
      age: 30,
      designation: 'Admin',
      shakha: 'HQ',
    });
    console.log(`Default admin created: ${adminEmail} / ${adminPassword}`);
  }
}

// Register new user (role: user only)
exports.register = async (req, res) => {
  try {
    const { name, email, password, number, age, designation, shakha } = req.body;
    if (!name || !email || !password || !number || !age || !designation || !shakha) {
      return res.status(400).json({ msg: 'All fields required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'user', number, age, designation, shakha });
    res.status(201).json({ msg: 'User registered', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Login (admin or user)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
    
    // Find user by email only (role will be determined automatically)
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Ensure default admin on module load
ensureDefaultAdmin(); 