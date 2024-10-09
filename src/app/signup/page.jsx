"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
// import { IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans } from "@tabler/icons-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { cn } from "../../utils/cn";

function SignupFormDemo() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    firstname: "",
    lastname: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Please check your email", { duration: 15000 });
      router.push("/Account_verification_email");
    } catch (error) {
      console.log("Signup failed", error.message);
      if (error.response && error.response.data.error === "user already exists") {
        toast.error("User already exists", { duration: 15000 });
      } else {
        toast.error(error.message, { duration: 15000 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !(user.email && user.password && user.username)
    );
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent bg-gray-600">
      <div className="max-w-md w-full mx-auto p-4 rounded-none md:rounded-2xl shadow-input bg-gray-600 dark:bg-black flex flex-col items-center justify-center min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to SHIV-WEB
        </h2>
        <h1 className="py-2 text-neutral-200">{loading ? "Processing" : "Signup"}</h1>

        <form onSubmit={onSignup}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                value={user.firstname}
                onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                placeholder="Shiv"
                type="text"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                placeholder="Sharma"
                type="text"
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="Username">Username</Label>
            <Input
              id="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="Mr_Shiv_Sharma_1"
              type="text"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Shiv@gmail.com"
              type="email"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className="dark:text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-gray-500 transform -translate-y-1/2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={buttonDisabled}
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <Link className="text-white" href="/login">
            <h1 className="mt-1">
              <span>If you </span>
              <span className="text-gray-500">already have an account,</span>
              <span> just</span> <span className="text-gray-500">login</span>.
            </h1>
          </Link>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              {/* <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              {/* <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              {/* <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">OnlyFans</span>
              <BottomGradient />
            </button>
          </div>
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

export default SignupFormDemo;
