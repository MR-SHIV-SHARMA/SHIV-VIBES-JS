import mongoose from "mongoose";

// Create the schema for the AdvancedComposition
const advancedCompositionSchema = new mongoose.Schema(
  {
    Defining_Composition_Structure: { type: String, required: true },
    Starting_Points: { type: String, required: true },
    Planning_and_Parameters: { type: String, required: true },
    Techniques_and_Resources: { type: String, required: true },
    Collaboration_and_Chance: { type: String, required: true },
    Workshops_and_Education: { type: String, required: true },
    Advanced_Music_Theory: { type: String, required: true },
    Experimental_Approaches: { type: String, required: true },
    Cultural_Context: { type: String, required: true },
    Portfolio_Development: { type: String, required: true },
    Performance_and_Interpretation: { type: String, required: true },
    Technology_in_Composition: { type: String, required: true },
    Ethical_Considerations: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the model
const AdvancedComposition =
  mongoose.models.Advanced_Composition ||
  mongoose.model("Advanced_Composition", advancedCompositionSchema);

export default AdvancedComposition;
