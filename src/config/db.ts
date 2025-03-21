import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || "";

if (!MONGO_URI) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  if (require.main === module) {
    process.exit(1);
  }
}

// Cấu hình toàn cục cho mongoose
mongoose.set("strictQuery", false); // Hoặc true tùy vào yêu cầu ứng dụng

// Xử lý sự kiện kết nối
mongoose.connection.on("connected", () => {
  console.log("🔌 MongoDB connection established successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🔌 MongoDB connection disconnected");
});

// Xử lý khi process kết thúc
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

const connectDB = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("📊 MongoDB already connected");
      return true;
    }
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây nếu không thể chọn được server
      maxPoolSize: 10, // Số lượng kết nối tối đa trong pool
      minPoolSize: 2, // Giữ ít nhất 2 kết nối mở
    });

    console.log("✅ MongoDB Connected Successfully!");
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    if (require.main === module) {
      process.exit(1);
    }
    return false;
  }
};

// Thêm hàm kiểm tra kết nối
export const checkDBConnection = (): boolean => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
    99: "Uninitialized"
  };
  
  console.log(`MongoDB current state: ${states[state as keyof typeof states]}`);
  return state === 1;
};

// Thêm hàm đóng kết nối 
export const closeDBConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log("👋 MongoDB connection closed gracefully");
  }
};

export default connectDB;