"use client";
import React, { useState } from "react";

function MusicSchoolContactUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // To display success or error message

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/users/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Submitted successfully:", data);
        setStatus("Message sent successfully!");

        // Clear the form fields
        setEmail("");
        setMessage("");
      } else {
        const errorData = await response.json();
        console.error("Error submitting form:", errorData);
        setStatus(
          "User not found. Please log in or sign up before sending a message."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus(
        "User not found. Please log in or sign up before sending a message."
      );
    }
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-900 pt-16 sm:pt-20 px-4 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">
            Contact Us
          </h1>
          <p className="max-w-lg mx-auto my-2 text-sm text-center text-neutral-400">
            We&apos;re here to help with any questions about our courses,
            programs, or events. Reach out and let us know how we can assist you
            in your musical journey.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="rounded-lg border border-neutral-800 bg-neutral-950 focus:ring-teal-500 w-full p-4 placeholder:text-neutral-500 text-white"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              className="rounded-lg border border-neutral-800 bg-neutral-950 focus:ring-teal-500 w-full p-4 placeholder:text-neutral-500 text-white"
              rows={5}
              required
            ></textarea>
            {status && <p className="mt-4 text-center text-white">{status}</p>}
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MusicSchoolContactUs;
