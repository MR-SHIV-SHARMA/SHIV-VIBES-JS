import { NextResponse } from "next/server";
import MusicProduction from "../../../../models/Admin/Music_Production";
import { connect } from "../../../../dbConfig/dbConfig";
import { client, connectRedis } from "../../../../client"; // Import Redis client utilities
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
  await connectRedis(); // Ensure Redis is connected

  try {
    const body = await parseJsonBody(request);

    const { title, status, content, image } = body;

    if (!title || !status || !content || !image) {
      return jsonResponse(false, { error: "Missing required fields" }, 400);
    }

    const newCourse = new MusicProduction({
      title,
      status,
      content,
      image,
    });

    await newCourse.save();

    // Cache the newly created course in Redis
    await client.set(`course:${newCourse._id}`, JSON.stringify(newCourse));

    return jsonResponse(true, { data: newCourse }, 201);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function GET(request) {
  await connect(); // Ensure database is connected
  await connectRedis(); // Ensure Redis is connected

  try {
    const { query } = url.parse(request.url, true);
    const id = query.id;

    if (id) {
      // Check Redis cache first
      const cachedCourse = await client.get(`course:${id}`);
      if (cachedCourse) {
        return jsonResponse(true, { data: JSON.parse(cachedCourse) }, 200);
      }

      const course = await MusicProduction.findById(id);

      if (!course) {
        return jsonResponse(false, { error: "Course not found" }, 404);
      }

      // Cache the fetched course in Redis
      await client.set(`course:${id}`, JSON.stringify(course));

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
  await connectRedis(); // Ensure Redis is connected

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

    // Remove the course from Redis cache
    await client.del(`course:${id}`);

    return jsonResponse(true, { message: "Course deleted successfully" }, 200);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function PUT(request) {
  await connect(); // Ensure database is connected
  await connectRedis(); // Ensure Redis is connected

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

    // Update the Redis cache with the updated course
    await client.set(`course:${id}`, JSON.stringify(updatedCourse));

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
