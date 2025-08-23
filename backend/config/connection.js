import {mongoose} from "mongoose"
import "dotenv/config"
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB Not Connected");
    console.error(err.message);
    process.exit(1);
  }
};
