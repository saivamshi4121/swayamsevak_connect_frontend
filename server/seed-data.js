const mongoose = require('mongoose');
const Event = require('./models/Event');
const Shakha = require('./models/Shakha');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await Event.deleteMany({});
    await Shakha.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create a test user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const testUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      passwordHash,
      role: 'admin',
      number: '9999999999',
      age: 30,
      designation: 'Admin',
      shakha: 'Test Shakha',
    });
    console.log('Created test user');

    // Create sample events
    const events = [
      {
        eventName: 'Morning Yoga Session',
        description: 'Start your day with energizing yoga',
        date: new Date('2024-04-01T06:00:00Z'),
        type: 'Health',
        region: 'Delhi',
        participants: [],
        createdBy: testUser._id,
      },
      {
        eventName: 'Cultural Program',
        description: 'Traditional music and dance performance',
        date: new Date('2024-04-15T18:00:00Z'),
        type: 'Cultural',
        region: 'Mumbai',
        participants: [],
        createdBy: testUser._id,
      },
      {
        eventName: 'Community Service Drive',
        description: 'Help clean the local park',
        date: new Date('2024-04-20T08:00:00Z'),
        type: 'Service',
        region: 'Bangalore',
        participants: [],
        createdBy: testUser._id,
      },
    ];

    await Event.insertMany(events);
    console.log('Created sample events');

    // Create sample shakhas
    const shakhas = [
      {
        name: 'Delhi Central Shakha',
        location: { lat: 28.6139, lng: 77.2090 },
        region: 'Delhi',
        category: 'Urban',
        schedule: 'Daily 6:00 AM - 7:00 AM',
        organizer: testUser._id,
        visibility: true,
      },
      {
        name: 'Mumbai West Shakha',
        location: { lat: 19.0760, lng: 72.8777 },
        region: 'Mumbai',
        category: 'Urban',
        schedule: 'Daily 6:30 AM - 7:30 AM',
        organizer: testUser._id,
        visibility: true,
      },
      {
        name: 'Bangalore Tech Shakha',
        location: { lat: 12.9716, lng: 77.5946 },
        region: 'Bangalore',
        category: 'Urban',
        schedule: 'Weekends 7:00 AM - 8:00 AM',
        organizer: testUser._id,
        visibility: true,
      },
    ];

    await Shakha.insertMany(shakhas);
    console.log('Created sample shakhas');

    console.log('✅ Sample data created successfully!');
    console.log('Login credentials: admin@test.com / admin123');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    mongoose.disconnect();
  }
};

seedData();