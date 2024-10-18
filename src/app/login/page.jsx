"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    identifier: "", // Combined field for email or username
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for showing password

  const onLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(null); // Clear any existing error message

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data); // Log the entire response object
      toast.success("Login success");

      // Ensure the response contains the userId property
      const userId = response.data.userId;
      if (userId) {
        localStorage.setItem("userId", userId);
        console.log("User ID saved to localStorage:", userId);
      } else {
        console.error("User ID not found in response:", response.data);
      }

      // Redirect or reload the page after login
      window.location.reload();
    } catch (error) {
      console.log(
        "Login failed",
        error.response?.data?.error || "An error occurred"
      );
      toast.error(error.response?.data?.error || "An error occurred");
      setErrorMessage(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.identifier.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent bg-gray-600">
      <Toaster /> {/* Add Toaster here */}
      <div className="max-w-md w-full mx-auto bg-black rounded-none md:rounded-2xl px-4 shadow-input flex flex-col items-center justify-center md:bg-black border border-gray-300">
        <h2 className="font-bold text-xl mt-4 text-neutral-800 dark:text-neutral-200">
          Welcome to SHIV-WEB
        </h2>

        <h1 className="text-neutral-200">{loading ? "Processing" : "Login"}</h1>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        {/* Login credentials message */}
        <h1 className="text-xl font-bold mb-4 text-center">
          Please log in using the following credentials:
        </h1>
        <p className="text-center">
          Email: <strong className="text-blue-500">one@gmail.com</strong>
        </p>
        <p className="text-center mb-4">
          Password: <strong className="text-red-500">123456</strong>
        </p>

        <form className="my-8 w-full" onSubmit={onLogin}>
          <div className="sm:flex gap-2">
            <LabelInputContainer className="mb-4 w-full">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                value={user.identifier}
                onChange={(e) =>
                  setUser({ ...user, identifier: e.target.value })
                }
                placeholder="Email or Username"
                type="text"
                className="dark:text-white w-full"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 w-full relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                className="dark:text-white pr-10 w-full" // Add padding to the right for the icon
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 text-gray-500 transform -translate-y-1/2" // Position the icon
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                {/* Toggle the icon */}
              </button>
            </LabelInputContainer>
          </div>
          <button
            className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block dark:bg-gray-700 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--gray-800)_inset,0px_-1px_0px_0px_var(--gray-800)_inset]"
            type="submit"
            disabled={buttonDisabled}
          >
            {loading ? "Loading..." : "Login"}
            <BottomGradient />
          </button>
          <Link className="text-gray-900 dark:text-white" href="/signup">
            <h1 className="mt-2">
              Create a{" "}
              <span className="text-gray-500 dark:text-gray-400">SHIV-WEB</span>{" "}
              Account
            </h1>
          </Link>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default LoginPage;
