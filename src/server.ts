import { createServer } from 'http';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log(`🔄 Connecting to the database...`);
    await connectDB();
    console.log(`✅ Database connected successfully!`);

    createServer(app).listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
