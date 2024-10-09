import { NextRequest, NextResponse } from "next/server";
import Course from "../../../../models/Admin/All_Courses";
import { connect } from "../../../../dbConfig/dbConfig"; // Import database connection utilities
import { client, connectRedis } from "../../../../client"; // Import Redis client utilities

// Helper function to handle JSON response
const jsonResponse = (success, data, status) =>
  NextResponse.json({ success, ...data }, { status });

// Helper function to format videos
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

// Cache key constants
const CACHE_KEY = {
  COURSE: (id) => `course_${id}`,
  ALL_COURSES: "all_courses",
};

async function fetchCourseFromCache(id) {
  try {
    await connectRedis(); // Ensure Redis is connected
    const cacheValue = await client.get(CACHE_KEY.COURSE(id));
    return cacheValue ? JSON.parse(cacheValue) : null;
  } catch (error) {
    console.error("Error fetching course from cache:", error);
    return null;
  }
}

async function fetchAllCoursesFromCache() {
  try {
    await connectRedis(); // Ensure Redis is connected
    const cacheValue = await client.get(CACHE_KEY.ALL_COURSES);
    return cacheValue ? JSON.parse(cacheValue) : null;
  } catch (error) {
    console.error("Error fetching all courses from cache:", error);
    return null;
  }
}

async function updateCache(id) {
  try {
    await connectRedis(); // Ensure Redis is connected
    if (id) {
      const course = await Course.findById(id);
      if (course) {
        await client.set(CACHE_KEY.COURSE(id), JSON.stringify(course));
        await client.expire(CACHE_KEY.COURSE(id), 1); // 1 secound
      }
    }
    await client.del(CACHE_KEY.ALL_COURSES);
  } catch (error) {
    console.error("Error updating cache:", error);
  }
}

export async function POST(request) {
  await connect(); // Ensure database is connected

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
    await updateCache(newCourse._id.toString());

    return jsonResponse(true, { data: newCourse }, 201);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function GET(request) {
  await connect(); // Ensure database is connected

  try {
    await connectRedis(); // Ensure Redis is connected
    const urlObj = new URL(request.url);
    const id = urlObj.searchParams.get("id");

    if (id) {
      const cachedCourse = await fetchCourseFromCache(id);
      if (cachedCourse) {
        return jsonResponse(true, { data: cachedCourse }, 200);
      }

      const course = await Course.findById(id);
      if (!course) {
        return jsonResponse(false, { error: "Course not found" }, 404);
      }

      await updateCache(id);
      return jsonResponse(true, { data: course }, 200);
    } else {
      const cachedCourses = await fetchAllCoursesFromCache();
      if (cachedCourses) {
        return jsonResponse(true, { data: cachedCourses }, 200);
      }

      const courses = await Course.find();
      console.log("Fetched courses from database:", courses); // Debugging log

      await client.set(CACHE_KEY.ALL_COURSES, JSON.stringify(courses));
      await client.expire(CACHE_KEY.ALL_COURSES, 1); // 1 secound

      return jsonResponse(true, { data: courses }, 200);
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function DELETE(request) {
  await connect(); // Ensure database is connected

  try {
    await connectRedis(); // Ensure Redis is connected
    const urlObj = new URL(request.url);
    const id = urlObj.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing course ID" }, 400);
    }

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return jsonResponse(false, { error: "Course not found" }, 404);
    }

    await client.del(CACHE_KEY.COURSE(id));
    await client.del(CACHE_KEY.ALL_COURSES);

    return jsonResponse(true, { message: "Course deleted successfully" }, 200);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function PUT(request) {
  await connect(); // Ensure database is connected

  try {
    await connectRedis(); // Ensure Redis is connected
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

    await updateCache(id);
    return jsonResponse(
      true,
      { message: "Course updated successfully", data: updatedCourse },
      200
    );
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}
