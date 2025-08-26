const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const shakhaRoutes = require('./routes/shakha');
const eventRoutes = require('./routes/event');
const resourceRoutes = require('./routes/resource');
const sevaRoutes = require('./routes/seva');
const usersRoutes = require('./routes/users');
const adminController = require('./controllers/adminController');
const notificationsRoutes = require('./routes/notifications');
const http = require('http');
const { Server } = require('socket.io');
const helpRoutes = require('./routes/help');
const analyticsRoutes = require('./routes/analytics');
const healthRoutes = require('./routes/health');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/auth', authRoutes);
app.use('/shakhas', shakhaRoutes);
app.use('/events', eventRoutes);
app.use('/resources', resourceRoutes);
app.use('/seva', sevaRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/help', helpRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/health', healthRoutes);

// Admin stats endpoint
const auth = require('./middleware/auth');
const roles = require('./middleware/roles');
app.get('/admin/stats', auth, roles('admin'), adminController.getStats);

app.use('/users', usersRoutes);

app.get('/', (req, res) => res.send('API running'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Store user sockets
const userSockets = new Map();

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
  });
  socket.on('disconnect', () => {
    for (const [userId, sockId] of userSockets.entries()) {
      if (sockId === socket.id) userSockets.delete(userId);
    }
  });
});

app.set('io', io);
app.set('userSockets', userSockets);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
