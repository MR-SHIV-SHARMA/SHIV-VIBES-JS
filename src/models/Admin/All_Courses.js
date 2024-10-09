import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  intro: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: { type: String, required: true },
    isFeatured: { type: Boolean, required: true },
    isFree: { type: Boolean, required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    totalDuration: { type: String, required: true },
    accessPeriod: { type: String, required: true },
    totalSales: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    videos: { type: [videoSchema], required: true },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
