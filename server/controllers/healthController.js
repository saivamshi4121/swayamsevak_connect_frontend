const mongoose = require('mongoose');

exports.getSystemHealth = async (req, res) => {
  try {
    const uptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const nodeVersion = process.version;

    const mongoState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting

    res.json({
      uptimeSeconds,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      cpu: cpuUsage,
      nodeVersion,
      database: {
        connected: mongoState === 1,
        state: mongoState,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch system health', error: err.message });
  }
};


