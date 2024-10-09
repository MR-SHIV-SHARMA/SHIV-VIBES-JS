import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/users/user.models";
import Course from "../../../../models/Admin/All_Courses";

connect();

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;
  const { courseId } = req.body;

  switch (method) {
    case "POST":
      try {
        const user = await User.findById(id);
        const course = await Course.findById(courseId);

        if (!user || !course) {
          return res
            .status(404)
            .json({ success: false, message: "User or Course not found" });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
