"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import {
  FaHome,
  FaBook,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaUserShield,
  FaSignInAlt,
} from "react-icons/fa";
import { Menu, MenuItem, HoveredLink } from "./ui/navbar-menu";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Determine if dark mode is enabled
  const isDarkMode = false;

  // List of paths where the navbar should be hidden
  const hiddenPaths = [
    "/Admin",
    "/Admin/Home",
    "/Admin/Courses_Lists",
    "/Admin/All_Courses",
    "/Admin/Music_Production",
    "/Admin/SongWriting",
    "/Admin/Advanced_Composition",
    "/Admin/Basic_Music",
    "/contact",
    "/courses/1",
    "/courses/2",
    "/courses/3",
    "/courses/4",
    "/courses/5",
    "/courses/6",
    "/courses/7",
    "/courses/8",
    "/courses/9",
    "/courses/10",
    "/courses/11",
    "/courses/12",
    "/Songwriting",
    "/Music_Production",
    "/Advanced_Composition",
    "/basic_music",
    "/login",
    "/signup",
    "/Account_verification_email",
    "/profile",
    "/verifyemail",
  ];

  // Fetch user status on mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(
            `/api/users/signup?userId=${userId}`
          );
          setIsLoggedIn(response.data.user.status);
          setIsAdmin(response.data.user.isAdmin);

          if (pathname.startsWith("/Admin")) {
            if (!response.data.user.status) {
              router.push("/login");
            } else if (!response.data.user.isAdmin) {
              router.push("/");
            }
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          if (pathname.startsWith("/Admin")) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user status:", error.message);
        if (pathname.startsWith("/Admin")) {
          router.push("/login");
        }
      }
    };
    fetchUserStatus();
  }, [pathname, router]);

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      setIsAdmin(false);
      toast.success("Logout successful");
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error("Logout failed");
    }
  };

  // Return null if pathname matches hiddenPaths
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <div
      className={clsx(
        "fixed top-5 px-4 text-2xl inset-x-0 max-w-2xl mx-auto z-50",
        className
      )}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <Menu setActive={setActive} isDarkMode={isDarkMode}>
        <Link href="/">
          <MenuItem
            setActive={setActive}
            active={active}
            item=""
            icon={<FaHome />}
            showOnlyIconOnSmallScreen={true}
          />
        </Link>
        <MenuItem
          setActive={setActive}
          active={active}
          item=" "
          icon={<FaBook />}
          showOnlyIconOnSmallScreen={true}
        >
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/NavComponent/courses">All Courses</HoveredLink>
            <HoveredLink href="/NavComponent/basic_music">
              Basic Music Theory
            </HoveredLink>
            <HoveredLink href="/NavComponent/Advanced_Composition">
              Advanced Composition
            </HoveredLink>
            <HoveredLink href="/NavComponent/Songwriting">
              Songwriting
            </HoveredLink>
            <HoveredLink href="/NavComponent/Music_Production">
              Music Production
            </HoveredLink>
          </div>
        </MenuItem>
        <Link href="/contact">
          <MenuItem
            setActive={setActive}
            active={active}
            item=""
            icon={<FaEnvelope />}
            showOnlyIconOnSmallScreen={true}
          />
        </Link>
        <Link href="/profile">
          <MenuItem
            setActive={setActive}
            active={active}
            item=""
            icon={<FaUser />}
            showOnlyIconOnSmallScreen={true}
          />
        </Link>
        {isAdmin && (
          <Link href="/Admin">
            <MenuItem
              setActive={setActive}
              active={active}
              item=""
              icon={<FaUserShield />}
              showOnlyIconOnSmallScreen={true}
            />
          </Link>
        )}
        {isLoggedIn ? (
          <MenuItem
            setActive={setActive}
            active={active}
            item=""
            icon={<FaSignOutAlt onClick={logout} />}
            showOnlyIconOnSmallScreen={true}
          />
        ) : (
          <Link href="/login">
            <MenuItem
              setActive={setActive}
              active={active}
              item=""
              icon={<FaSignInAlt />}
              showOnlyIconOnSmallScreen={true}
            />
          </Link>
        )}
      </Menu>
    </div>
  );
}

export default Navbar;
