/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = useCallback(async () => {
    try {
      await axios.post("../api/users/verifyemail", { token });
      setVerified(true);
      setError(false);
    } catch (error) {
      setError(true);
      console.log(error.response);
    }
  }, [token]); // Add token as a dependency

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]); // Include verifyUserEmail here

  return (
    <div className="bg-gray-400 dark:bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-gray-300 dark:bg-gray-800 p-6 mt-20 rounded-lg shadow-lg max-w-sm w-full text-center">
        <img
          className="mx-auto mb-4"
          src="/Account-verification-email-templates.avif"
          alt="Verification"
          width={150}
          height={150}
        />
        <h2 className="text-2xl text-gray-500 dark:text-gray-200 font-bold mb-2">
          Verify Your Email
        </h2>
        <h2 className="p-2 bg-orange-500 text-black dark:text-white rounded-full overflow-hidden">
          {token ? `${token}` : "no token"}
        </h2>

        {verified ? (
          <VerificationSuccess />
        ) : error ? (
          <VerificationError />
        ) : null}
      </div>
    </div>
  );
}

const VerificationSuccess = () => (
  <>
    <h2 className="text-2xl text-gray-500 dark:text-gray-200 mt-2">
      Email Verified
    </h2>
    <p className="text-gray-600 dark:text-gray-400 my-1">
      Your account has been verified. Now you can click the button to log in to your account.
    </p>
    <Link href="/login">
      <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </Link>
  </>
);

const VerificationError = () => (
  <>
    <h2 className="text-2xl bg-red-600 dark:bg-red-800 mt-3 rounded-full text-black dark:text-white">
      Error
    </h2>
    <p className="text-gray-600 dark:text-gray-400 my-4">
      Your account is already verified. Please login to your account.
    </p>
  </>
);
