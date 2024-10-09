import mongoose from "mongoose";

// Define the schema to match the updated structure
const basicMusicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
    key_elements: {
      Notes: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Scales: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Chords: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Rhythm: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Melody: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Harmony: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Form: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
    },
    additional_topics: {
      Intervals: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Dynamics: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Articulation: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      Timbre: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      SightReading: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
      EarTraining: {
        description: { type: String, required: true },
        quote: { type: String, required: true },
      },
    },
    tips_for_beginners: { type: [String], required: true },
    resources: { type: [String], required: true },
    conclusion: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the model
const Basic_Music =
  mongoose.models.Basic_Music ||
  mongoose.model("Basic_Music", basicMusicSchema);

export default Basic_Music;
