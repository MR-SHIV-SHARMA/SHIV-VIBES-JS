import { NextResponse } from "next/server";
import Basic_Music from "../../../../models/Admin/Basic_Music";
import { connect } from "../../../../dbConfig/dbConfig";
import url from "url";

// Helper function to handle JSON response
const jsonResponse = (success, data, status) =>
  NextResponse.json({ success, ...data }, { status });

// Helper function to check and parse JSON body
async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch (error) {
    console.error("Error parsing JSON body:", error);
    throw new Error("Invalid JSON body");
  }
}

export async function POST(request) {
  await connect(); // Ensure database is connected

  try {
    const body = await parseJsonBody(request);

    const {
      title,
      status,
      description,
      key_elements,
      additional_topics,
      tips_for_beginners,
      resources,
      conclusion,
    } = body;

    const newCourse = new Basic_Music({
      title,
      status,
      description,
      key_elements,
      additional_topics,
      tips_for_beginners,
      resources,
      conclusion,
    });

    await newCourse.save();

    return jsonResponse(true, { data: newCourse }, 201);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function GET(request) {
  await connect(); // Ensure database is connected

  try {
    const { query } = url.parse(request.url, true);
    const id = query.id;

    if (id) {
      const course = await Basic_Music.findById(id);
      if (!course) {
        return jsonResponse(false, { error: "Course not found" }, 404);
      }
      return jsonResponse(true, { data: course }, 200);
    } else {
      const courses = await Basic_Music.find();
      return jsonResponse(true, { data: courses }, 200);
    }
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function DELETE(request) {
  await connect(); // Ensure database is connected

  try {
    const { query } = url.parse(request.url, true);
    const id = query.id;

    if (!id) {
      return jsonResponse(false, { error: "Missing course ID" }, 400);
    }

    const deletedCourse = await Basic_Music.findByIdAndDelete(id);
    if (!deletedCourse) {
      return jsonResponse(false, { error: "Course not found" }, 404);
    }

    return jsonResponse(true, { message: "Course deleted successfully" }, 200);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function PUT(request) {
  await connect(); // Ensure database is connected

  try {
    const { query } = url.parse(request.url, true);
    const id = query.id;

    if (!id) {
      return jsonResponse(false, { error: "Missing course ID" }, 400);
    }

    const body = await parseJsonBody(request);

    const {
      title,
      status,
      description,
      key_elements,
      additional_topics,
      tips_for_beginners,
      resources,
      conclusion,
    } = body;

    if (
      !title ||
      !status ||
      !description ||
      !key_elements ||
      !additional_topics ||
      !tips_for_beginners ||
      !resources ||
      !conclusion
    ) {
      return jsonResponse(false, { error: "Missing required fields" }, 400);
    }

    const updatedCourse = await Basic_Music.findByIdAndUpdate(
      id,
      {
        title,
        status,
        description,
        key_elements,
        additional_topics,
        tips_for_beginners,
        resources,
        conclusion,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return jsonResponse(false, { error: "Course not found" }, 404);
    }

    return jsonResponse(
      true,
      { message: "Course updated successfully", data: updatedCourse },
      200
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return jsonResponse(false, { error: error.message }, 400);
  }
}
