"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import {
  FaHome,
  FaShoppingCart,
  FaBox,
  FaCogs,
  FaClipboardList,
  FaTools,
} from "react-icons/fa";

const AdminSlider = () => {
  const [activePage, setActivePage] = useState("/Admin");
  const handleSetActivePage = (pagePath) => {
    setActivePage(pagePath);
  };

  const isActive = (pagePath) => {
    return activePage === pagePath
      ? "text-gray-900 bg-gray-300"
      : "text-gray-600";
  };

  return (
    <div className="text-start justify-start">
      <ul className="bg-gray-200 w-16 min-h-screen p-3  flex flex-col text-4xl fixed">
        <li className="text-white flex justify-center items-center py-4">
          <Image
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            width={50} // Set the width of your logo
            height={50} // Set the height of your logo
            className="mx-auto rounded-full" // Center the logo
          />
        </li>
        <li
          className={`flex justify-center items-center py-4 ${isActive(
            "/Admin"
          )}`}
          onClick={() => handleSetActivePage("/Admin")}
        >
          <FaHome className="mr-2 cursor-pointer" />
          <Link href="/Admin">
            <FaHome className="mr-2 cursor-pointer" />
          </Link>
        </li>

        <li
          className={`flex justify-center items-center py-4 ${isActive(
            "/Admin/Courses_Lists"
          )}`}
          onClick={() => handleSetActivePage("/Admin/Courses_Lists")}
        >
          <FaClipboardList className="mr-2 cursor-pointer" />
          <Link href="/Admin/Courses_Lists">
            <FaClipboardList className="mr-2 cursor-pointer" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSlider;
