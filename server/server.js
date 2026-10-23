require('dotenv').config();
const app = require('./app');
const { connectDB, isMongoConnected } = require('./config/db');
const seedAll = require('./scripts/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect database (with graceful local fallback)
  await connectDB();

  // If MongoDB connected, run idempotent seeds
  if (isMongoConnected()) {
    try {
      await seedAll();
    } catch (e) {
      console.warn('[Server] MongoDB auto-seed notice:', e.message);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🌸 SREE SAREES BACKEND SERVER RUNNING`);
    console.log(`   Tagline: "Tradition Woven with Elegance."`);
    console.log(`   Port: ${PORT}`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   Persistence: ${isMongoConnected() ? 'MongoDB' : 'Local Persistent JSON Store'}`);
    console.log(`================================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Server Unhandled Rejection]`, err.message);
  });
};

startServer();
