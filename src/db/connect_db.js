import mongoose from "mongoose";

export default async function connectDB(URI) {
    try {
      await mongoose.connect(URI, {
          serverSelectionTimeoutMS: 30000
      });
        console.log("Mongo DB Connected Successfully");
    } catch (error) {
        console.log("Mongo Db Failed", error);
        
    }
}
