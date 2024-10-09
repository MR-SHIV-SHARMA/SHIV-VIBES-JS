import { NextResponse } from "next/server";
import AdvancedComposition from "../../../../models/Admin/Advanced_Composition";
import { connect } from "../../../../dbConfig/dbConfig";
import { client, connectRedis } from "../../../../client"; // Import Redis client utilities

// Cache key constants
const CACHE_KEY = {
  COMPOSITION: (id) => `composition_${id}`,
  ALL_COMPOSITIONS: "all_compositions",
};

// Helper function to handle JSON response
const jsonResponse = (success, data, status) =>
  NextResponse.json({ success, ...data }, { status });

// Helper function to fetch composition from cache
async function fetchCompositionFromCache(id) {
  try {
    await connectRedis(); // Ensure Redis is connected
    const cacheValue = await client.get(CACHE_KEY.COMPOSITION(id));
    return cacheValue ? JSON.parse(cacheValue) : null;
  } catch (error) {
    console.error("Error fetching composition from cache:", error);
    return null;
  }
}

// Helper function to fetch all compositions from cache
async function fetchAllCompositionsFromCache() {
  try {
    await connectRedis(); // Ensure Redis is connected
    const cacheValue = await client.get(CACHE_KEY.ALL_COMPOSITIONS);
    return cacheValue ? JSON.parse(cacheValue) : null;
  } catch (error) {
    console.error("Error fetching all compositions from cache:", error);
    return null;
  }
}

// Helper function to update cache
async function updateCache(id) {
  try {
    await connectRedis(); // Ensure Redis is connected
    if (id) {
      const composition = await AdvancedComposition.findById(id);
      if (composition) {
        await client.set(
          CACHE_KEY.COMPOSITION(id),
          JSON.stringify(composition)
        );
        await client.expire(CACHE_KEY.COMPOSITION(id), 3600); // 1 hour
      }
    }
    await client.del(CACHE_KEY.ALL_COMPOSITIONS);
  } catch (error) {
    console.error("Error updating cache:", error);
  }
}

export async function POST(request) {
  await connect(); // Ensure database is connected

  try {
    const {
      Defining_Composition_Structure,
      Starting_Points,
      Planning_and_Parameters,
      Techniques_and_Resources,
      Collaboration_and_Chance,
      Workshops_and_Education,
      Advanced_Music_Theory,
      Experimental_Approaches,
      Cultural_Context,
      Portfolio_Development,
      Performance_and_Interpretation,
      Technology_in_Composition,
      Ethical_Considerations,
    } = await request.json();

    const newComposition = new AdvancedComposition({
      Defining_Composition_Structure,
      Starting_Points,
      Planning_and_Parameters,
      Techniques_and_Resources,
      Collaboration_and_Chance,
      Workshops_and_Education,
      Advanced_Music_Theory,
      Experimental_Approaches,
      Cultural_Context,
      Portfolio_Development,
      Performance_and_Interpretation,
      Technology_in_Composition,
      Ethical_Considerations,
    });

    await newComposition.save();
    await updateCache(newComposition._id.toString());

    return jsonResponse(true, { data: newComposition }, 201);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function GET(request) {
  await connect(); // Ensure database is connected

  try {
    await connectRedis(); // Ensure Redis is connected
    const parsedUrl = new URL(request.url);
    const id = parsedUrl.searchParams.get("id");

    if (id) {
      const cachedComposition = await fetchCompositionFromCache(id);
      if (cachedComposition) {
        return jsonResponse(true, { data: cachedComposition }, 200);
      }

      const composition = await AdvancedComposition.findById(id);
      if (!composition) {
        return jsonResponse(false, { error: "Composition not found" }, 404);
      }

      await updateCache(id);
      return jsonResponse(true, { data: composition }, 200);
    } else {
      const cachedCompositions = await fetchAllCompositionsFromCache();
      if (cachedCompositions) {
        return jsonResponse(true, { data: cachedCompositions }, 200);
      }

      const compositions = await AdvancedComposition.find();
      console.log("Fetched compositions from database:", compositions); // Debugging log

      await client.set(
        CACHE_KEY.ALL_COMPOSITIONS,
        JSON.stringify(compositions)
      );
      await client.expire(CACHE_KEY.ALL_COMPOSITIONS, 3600); // 1 hour

      return jsonResponse(true, { data: compositions }, 200);
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
    const parsedUrl = new URL(request.url);
    const id = parsedUrl.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing composition ID" }, 400);
    }

    const deletedComposition = await AdvancedComposition.findByIdAndDelete(id);
    if (!deletedComposition) {
      return jsonResponse(false, { error: "Composition not found" }, 404);
    }

    await client.del(CACHE_KEY.COMPOSITION(id));
    await client.del(CACHE_KEY.ALL_COMPOSITIONS);

    return jsonResponse(
      true,
      { message: "Composition deleted successfully" },
      200
    );
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function PUT(request) {
  await connect(); // Ensure database is connected

  try {
    await connectRedis(); // Ensure Redis is connected
    const parsedUrl = new URL(request.url);
    const id = parsedUrl.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing composition ID" }, 400);
    }

    const body = await request.json();
    console.log("Request body:", body);

    const {
      Defining_Composition_Structure,
      Starting_Points,
      Planning_and_Parameters,
      Techniques_and_Resources,
      Collaboration_and_Chance,
      Workshops_and_Education,
      Advanced_Music_Theory,
      Experimental_Approaches,
      Cultural_Context,
      Portfolio_Development,
      Performance_and_Interpretation,
      Technology_in_Composition,
      Ethical_Considerations,
    } = body;

    // Validate required fields
    if (
      !Defining_Composition_Structure ||
      !Starting_Points ||
      !Planning_and_Parameters ||
      !Techniques_and_Resources ||
      !Collaboration_and_Chance ||
      !Workshops_and_Education ||
      !Advanced_Music_Theory ||
      !Experimental_Approaches ||
      !Cultural_Context ||
      !Portfolio_Development ||
      !Performance_and_Interpretation ||
      !Technology_in_Composition ||
      !Ethical_Considerations
    ) {
      return jsonResponse(false, { error: "Missing required fields" }, 400);
    }

    const updatedComposition = await AdvancedComposition.findByIdAndUpdate(
      id,
      {
        Defining_Composition_Structure,
        Starting_Points,
        Planning_and_Parameters,
        Techniques_and_Resources,
        Collaboration_and_Chance,
        Workshops_and_Education,
        Advanced_Music_Theory,
        Experimental_Approaches,
        Cultural_Context,
        Portfolio_Development,
        Performance_and_Interpretation,
        Technology_in_Composition,
        Ethical_Considerations,
      },
      { new: true, runValidators: true }
    );

    if (!updatedComposition) {
      return jsonResponse(false, { error: "Composition not found" }, 404);
    }

    await updateCache(id);
    return jsonResponse(
      true,
      { message: "Composition updated successfully", data: updatedComposition },
      200
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return jsonResponse(false, { error: error.message }, 400);
  }
}
