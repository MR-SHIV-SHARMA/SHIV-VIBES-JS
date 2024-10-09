import { NextResponse } from "next/server";
import Section from "../../../../models/Admin/SectionModel";
import { connect } from "../../../../dbConfig/dbConfig";
import { client, connectRedis } from "../../../../client"; // Import Redis client utilities

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

    // Ensure the body is an array
    const sectionsData = Array.isArray(body) ? body : [body];

    const savedSections = [];
    
    for (const sectionData of sectionsData) {
      const { title, status, imageurl, songname, artistname, songurl, content } = sectionData;

      // Collect missing fields
      const missingFields = [];
      if (!title) missingFields.push('title');
      if (!status) missingFields.push('status');
      if (!imageurl) missingFields.push('imageurl');
      if (!songname) missingFields.push('songname');
      if (!artistname) missingFields.push('artistname');
      if (!songurl) missingFields.push('songurl');
      if (!content) missingFields.push('content');

      if (missingFields.length > 0) {
        return jsonResponse(false, { error: "Missing required fields", missingFields }, 400);
      }

      const newSection = new Section({
        title,
        status,
        imageurl,
        songname,
        artistname,
        songurl,
        content,
      });

      const savedSection = await newSection.save();
      savedSections.push(savedSection);
      await client.set(`section:${savedSection._id}`, JSON.stringify(savedSection)); // Cache the saved section
    }

    return jsonResponse(true, { data: savedSections }, 201);
  } catch (error) {
    console.error("Error in POST request:", error);
    return jsonResponse(false, { error: error.message }, 500);
  }
}




export async function GET(request) {
  await connect(); // Ensure database is connected
  await connectRedis(); // Ensure Redis is connected

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Check Redis cache first
      const cachedSection = await client.get(`section:${id}`);
      if (cachedSection) {
        return jsonResponse(true, { data: JSON.parse(cachedSection) }, 200);
      }

      const section = await Section.findById(id);
      if (!section) {
        return jsonResponse(false, { error: "Section not found" }, 404);
      }

      // Cache the fetched section in Redis
      await client.set(`section:${id}`, JSON.stringify(section));

      return jsonResponse(true, { data: section }, 200);
    } else {
      const sections = await Section.find();
      return jsonResponse(true, { data: sections }, 200);
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return jsonResponse(false, { error: error.message }, 500);
  }
}

export async function DELETE(request) {
  await connect(); // Ensure database is connected
  await connectRedis(); // Ensure Redis is connected

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing section ID" }, 400);
    }

    const deletedSection = await Section.findByIdAndDelete(id);
    if (!deletedSection) {
      return jsonResponse(false, { error: "Section not found" }, 404);
    }

    // Remove the section from Redis cache
    await client.del(`section:${id}`);

    return jsonResponse(true, { message: "Section deleted successfully" }, 200);
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return jsonResponse(false, { error: error.message }, 500);
  }
}

export async function PUT(request) {
  await connect(); // Ensure database is connected
  await connectRedis(); // Ensure Redis is connected

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing section ID" }, 400);
    }

    const body = await parseJsonBody(request);

    const { title, status, content, imageurl, songname, artistname, songurl } =
      body;

    if (
      !title &&
      !status &&
      !content &&
      !imageurl &&
      !songname &&
      !artistname &&
      !songurl
    ) {
      return jsonResponse(false, { error: "Missing fields to update" }, 400);
    }

    const updatedSection = await Section.findByIdAndUpdate(
      id,
      { title, status, content, imageurl, songname, artistname, songurl },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return jsonResponse(false, { error: "Section not found" }, 404);
    }

    // Update the Redis cache with the updated section
    await client.set(`section:${id}`, JSON.stringify(updatedSection));

    return jsonResponse(
      true,
      { message: "Section updated successfully", data: updatedSection },
      200
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return jsonResponse(false, { error: error.message }, 500);
  }
}
