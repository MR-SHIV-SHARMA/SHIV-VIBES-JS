import { connect } from "../../../../dbConfig/dbConfig";
import Contact from "../../../../models/Contact/contact.models";
import User from "../../../../models/users/user.models";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();

  try {
    const { email, message } = await request.json();

    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User not found. Please log in or sign up before sending a message.",
        },
        { status: 404 }
      );
    }

    const contact = new Contact({
      email: user._id,
      message,
    });

    await contact.save();

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
