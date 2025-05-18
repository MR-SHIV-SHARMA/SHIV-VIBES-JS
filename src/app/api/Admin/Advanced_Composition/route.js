import { NextResponse } from "next/server";
import AdvancedComposition from "../../../../models/Admin/Advanced_Composition";
import { connect } from "../../../../dbConfig/dbConfig";

// Helper function to handle JSON response
const jsonResponse = (success, data, status) =>
  NextResponse.json({ success, ...data }, { status });

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

    return jsonResponse(true, { data: newComposition }, 201);
  } catch (error) {
    return jsonResponse(false, { error: error.message }, 400);
  }
}

export async function GET(request) {
  await connect(); // Ensure database is connected

  try {
    const parsedUrl = new URL(request.url);
    const id = parsedUrl.searchParams.get("id");

    if (id) {
      const composition = await AdvancedComposition.findById(id);
      if (!composition) {
        return jsonResponse(false, { error: "Composition not found" }, 404);
      }

      return jsonResponse(true, { data: composition }, 200);
    } else {
      const compositions = await AdvancedComposition.find();
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
    const parsedUrl = new URL(request.url);
    const id = parsedUrl.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing composition ID" }, 400);
    }

    const deletedComposition = await AdvancedComposition.findByIdAndDelete(id);
    if (!deletedComposition) {
      return jsonResponse(false, { error: "Composition not found" }, 404);
    }

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
    const parsedUrl = new URL(request.url);
    const id = parsedUrl.searchParams.get("id");

    if (!id) {
      return jsonResponse(false, { error: "Missing composition ID" }, 400);
    }

    const body = await request.json();

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
