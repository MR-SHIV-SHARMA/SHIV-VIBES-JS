import mongoose from "mongoose";

// Define the schema to match the updated structure
const musicProductionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the model
const MusicProduction =
  mongoose.models.MusicProduction ||
  mongoose.model("MusicProduction", musicProductionSchema);

export default MusicProduction;
