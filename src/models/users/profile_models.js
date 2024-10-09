import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true, unique: true }, // Ensure username is unique
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    profile: { type: String, required: false },
    firstName: { type: String, required: false },
    birthday: { type: String, required: false },
    lastName: { type: String, required: false },
    phone: { type: String, required: false },
    city: { type: String, required: false },
    hobbies: { type: String, required: false },
    studentId: { type: String, required: false },
    genresStyles: { type: String, required: false },
    performanceExperience: { type: String, required: false },
    achievementsAwards: { type: String, required: false },
    musicEducationHistory: { type: String, required: false },
    SocialMediaLinkForInstagram: { type: String, required: false },
    SocialMediaLinkForYoutube: { type: String, required: false },
    SocialMediaLinkForLinkdin: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

export default Profile;







// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, unique: true, required: true }, // Ensure unique constraint and required
//     firstname: {
//       type: String,
//       required: [true, "Please provide a lastname"],
//     },
//     lastname: {
//       type: String,
//       required: [true, "Please provide a lastname"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please provide a email"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Please provide a password"],
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
    
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: Boolean,
//       default: false,
//     },
//     forgotPasswordToken: String,
//     forgotPasswordTokenExpiry: Date,
//     verifyToken: String,
//     verifyTokenExpiry: Date,
//     enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
//   },
//   { timestamps: true }
// );

// const User = mongoose.models.user || mongoose.model("user", userSchema);

// export default User;
