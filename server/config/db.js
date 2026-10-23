const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sree_sarees';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.log(`[Database Notice] MongoDB is not running on ${uri}. Operating in Local Persistent JSON Store mode.`);
    console.log(`[Database Notice] All data, users, orders, and inventory will be safely saved in server/data/.`);
    console.log(`[Database Notice] To connect to MongoDB Atlas or local daemon, update MONGODB_URI in server/.env`);
    return false;
  }
};

module.exports = {
  connectDB,
  isMongoConnected: () => isConnected
};
