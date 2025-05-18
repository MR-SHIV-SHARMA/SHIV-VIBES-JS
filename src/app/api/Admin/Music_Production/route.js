import { NextResponse } from "next/server";
import MusicProduction from "../../../../models/Admin/Music_Production";
import { connect } from "../../../../dbConfig/dbConfig";
import url from "url";

// Helper function to handle JSON responses
const jsonResponse = (success, data, status) =>
  NextResponse.json({ success, ...data }, { status });

// Helper function to parse JSON body
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
    const { title, status, content, image } = body;

    if (!title || !status || !content || !image) {
      return jsonResponse(false, { error: "Missing required fields" }, 400);
    }

    const newCourse = new MusicProduction({ title, status, content, image });
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
      const course = await MusicProduction.findById(id);
      if (!course) {
        return jsonResponse(false, { error: "Course not found" }, 404);
      }
      return jsonResponse(true, { data: course }, 200);
    } else {
      const courses = await MusicProduction.find();
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

    const deletedCourse = await MusicProduction.findByIdAndDelete(id);
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
    const { title, status, content, image } = body;

    if (!title && !status && !content && !image) {
      return jsonResponse(false, { error: "Missing fields to update" }, 400);
    }

    const updatedCourse = await MusicProduction.findByIdAndUpdate(
      id,
      { title, status, content, image },
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
