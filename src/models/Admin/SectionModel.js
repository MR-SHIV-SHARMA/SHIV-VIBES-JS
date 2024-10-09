import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, required: true },
    imageurl: { type: String, required: true },
    songname: { type: String, required: true },
    artistname: { type: String, required: true },
    songurl: { type: String, required: true },
    content: {
      point1: { type: String, required: true },
      point2: { type: String, required: true },
      point3: { type: String, required: true },
      point4: { type: String }, // This is optional
    },
  },
  { timestamps: true }
);


const Section =
  mongoose.models.Section || mongoose.model("Section", SectionSchema);

export default Section;
