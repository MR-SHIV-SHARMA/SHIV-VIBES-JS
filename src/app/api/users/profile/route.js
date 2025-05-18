import { NextResponse } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig"; // Ensure this correctly sets up Mongoose connection
import User from "../../../../models/users/user.models";
import Profile from "../../../../models/users/profile_models";

export async function POST(request) {
  await connect(); // Connect to the database

  try {
    const body = await request.json(); // Parse the JSON data from the request body
    const {
      userId,
      profile,
      birthday,
      phone,
      city,
      hobbies,
      studentId,
      genresStyles,
      performanceExperience,
      achievementsAwards,
      musicEducationHistory,
      SocialMediaLinkForInstagram,
      SocialMediaLinkForYoutube,
      SocialMediaLinkForLinkdin,
      bio,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId); // Find user by ID
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const newProfile = new Profile({
      userId: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      profile,
      birthday,
      phone,
      city,
      hobbies,
      studentId,
      genresStyles,
      performanceExperience,
      achievementsAwards,
      musicEducationHistory,
      SocialMediaLinkForInstagram,
      SocialMediaLinkForYoutube,
      SocialMediaLinkForLinkdin,
      bio,
    });

    try {
      await newProfile.save(); // Save the new profile to the database
    } catch (error) {
      if (error.code === 11000) {
        return NextResponse.json(
          { success: false, error: "Username or email already exists" },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { success: true, data: newProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating profile:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  await connect(); // Connect to the database

  try {
    const body = await request.json(); // Parse the JSON data from the request body
    const {
      userId,
      profile,
      firstName,
      birthday,
      lastName,
      phone,
      city,
      hobbies,
      studentId,
      genresStyles,
      performanceExperience,
      achievementsAwards,
      musicEducationHistory,
      SocialMediaLinkForInstagram,
      SocialMediaLinkForYoutube,
      SocialMediaLinkForLinkdin,
      bio,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        profile,
        firstName,
        lastName,
        birthday,
        phone,
        city,
        hobbies,
        studentId,
        genresStyles,
        performanceExperience,
        achievementsAwards,
        musicEducationHistory,
        SocialMediaLinkForInstagram,
        SocialMediaLinkForYoutube,
        SocialMediaLinkForLinkdin,
        bio,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  await connect(); // Connect to the database

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log(`Received GET request for userId: ${userId}`);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId query parameter is missing" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const profileData = profile.toObject();

    console.log("Profile retrieved successfully");
    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
