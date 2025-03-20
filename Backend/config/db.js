const mongoose = require('mongoose');

// Database connection URL - replace 'your_database_name' with your actual database name
const dbURI = 'mongodb://localhost/your_database_name';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;