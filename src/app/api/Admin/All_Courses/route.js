import { NextRequest, NextResponse } from "next/server";
import Course from "../../../../models/Admin/All_Courses";
import { connect } from "../../../../dbConfig/dbConfig"; // MongoDB connection

// Helper function to send JSON responses
const jsonResponse = (success, data, status) =>
  NextResponse.json({ success, ...data }, { status });

// Format videos helper
const formatVideos = (videos) =>
  videos
    ? videos.map((video) => ({
        title: video.title,
        duration: video.duration,
        intro: video.intro,
        description: video.description,
        videoUrl: video.videoUrl,
      }))
    : [];

export async function POST(request) {
  await connect();

  try {
    const {
      title,
      status,
      slug,
      description,
      price,
      instructor,
      isFeatured,
      isFree,
      thumbnail,
      videoUrl,
      totalSales,
      totalDuration,
      accessPeriod,
      videos,
      createdAt,
    } = await request.json();

    const newCourse = new Course({
      title,
      status,
      slug,
      description,
      price,
      instructor,
      isFeatured,
      isFree,
      thumbnail,
      videoUrl,
      totalSales,
      totalDuration,
      accessPeriod,
      videos: formatVideos(videos),
      createdAt,
    });

    await newCourse.save();
    return jsonResponse(true, { data: newCourse }, 201);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function GET(request) {
  await connect();

  try {
    const urlObj = new URL(request.url);
    const id = urlObj.searchParams.get("id");

    if (id) {
      const course = await Course.findById(id);
      if (!course) {
        return jsonResponse(false, { error: "Course not found" }, 404);
      }
      return jsonResponse(true, { data: course }, 200);
    } else {
      const courses = await Course.find();
      return jsonResponse(true, { data: courses }, 200);
    }
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function DELETE(request) {
  await connect();

  try {
    const urlObj = new URL(request.url);
    const id = urlObj.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing course ID" }, 400);
    }

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return jsonResponse(false, { error: "Course not found" }, 404);
    }

    return jsonResponse(true, { message: "Course deleted successfully" }, 200);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function PUT(request) {
  await connect();

  try {
    const urlObj = new URL(request.url);
    const id = urlObj.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing course ID" }, 400);
    }

    const body = await request.json();
    const {
      title,
      status,
      slug,
      description,
      price,
      instructor,
      isFeatured,
      isFree,
      thumbnail,
      videoUrl,
      totalSales,
      totalDuration,
      accessPeriod,
      videos,
      createdAt,
    } = body;

    if (
      !title ||
      !slug ||
      !description ||
      !price ||
      !instructor ||
      !thumbnail ||
      !videoUrl
    ) {
      return jsonResponse(false, { error: "Missing required fields" }, 400);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        status,
        slug,
        description,
        price,
        instructor,
        isFeatured,
        isFree,
        thumbnail,
        videoUrl,
        totalSales,
        totalDuration,
        accessPeriod,
        videos: formatVideos(videos),
        createdAt,
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
    return jsonResponse(false, { error: error.message }, 400);
  }
}
