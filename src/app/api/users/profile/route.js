import { NextResponse } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig"; // Ensure this correctly sets up Mongoose connection
import User from "../../../../models/users/user.models";
import Profile from "../../../../models/users/profile_models";
import { client as redisClient, connectRedis } from "../../../../client"; // Import Redis client utilities

const CACHE_KEY = {
  PROFILE: (id) => `profile:${id}`,
};

// Ensure Redis client is connected
async function ensureRedisConnection() {
  if (!redisClient.isOpen) {
    try {
      await connectRedis();
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      throw new Error("Redis connection failed");
    }
  }
}

// Fetch data from cache
async function fetchProfileFromCache(id) {
  try {
    await ensureRedisConnection(); // Ensure Redis is connected
    const cacheValue = await redisClient.get(CACHE_KEY.PROFILE(id));
    return cacheValue ? JSON.parse(cacheValue) : null;
  } catch (error) {
    console.error("Error fetching profile from cache:", error);
    return null;
  }
}

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

    // Check required fields
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

    // Create a new profile with the provided data
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
        // Duplicate key error code
        return NextResponse.json(
          { success: false, error: "Username or email already exists" },
          { status: 400 }
        );
      }
      throw error;
    }

    // Cache the new profile in Redis
    await ensureRedisConnection(); // Ensure Redis is connected
    await redisClient.set(
      CACHE_KEY.PROFILE(user._id.toString()),
      JSON.stringify(newProfile)
    );

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

    // Check required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find and update the existing profile by user ID
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
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Cache the updated profile in Redis
    await ensureRedisConnection(); // Ensure Redis is connected
    await redisClient.set(
      CACHE_KEY.PROFILE(user._id.toString()),
      JSON.stringify(updatedProfile)
    );

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

    // Try to get the profile from Redis cache
    await ensureRedisConnection(); // Ensure Redis is connected
    const cachedProfile = await redisClient.get(CACHE_KEY.PROFILE(userId));
    if (cachedProfile) {
      console.log("Profile retrieved from cache");
      return NextResponse.json({
        success: true,
        data: JSON.parse(cachedProfile),
      });
    }

    // If not in cache, fetch from the database
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

    const profileData = profile.toObject(); // Convert profile to plain object

    // Cache the retrieved profile
    await redisClient.set(
      CACHE_KEY.PROFILE(userId),
      JSON.stringify(profileData)
    );

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
