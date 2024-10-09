"use client";
import React from "react";
import Link from "next/link";
import AdminSlider from "../AdminSlider/page";

function Admin() {
  return (
    <div
      className="w-full min-h-screen bg-gray-300 text-gray-700 relative"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/923277/pexels-photo-923277.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <div className="flex">
          <AdminSlider />
          <div className="flex-1 min-h-screen ml-16 border p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Course Pages</h1>
            <ul className="space-y-4">
              <li className="text-lg text-white p-2 rounded-md shadow-md border hover:bg-gray-100 hover:text-gray-700 transition duration-300 cursor-pointer">
                <Link href="/Admin/All_Courses">All_Courses</Link>
              </li>
              <li className="text-lg text-white p-2 rounded-md shadow-md border hover:bg-gray-100 hover:text-gray-700 transition duration-300 cursor-pointer">
                <Link href="/Admin/Basic_Music">Basic_Music</Link>
              </li>
              <li className="text-lg text-white p-2 rounded-md shadow-md border hover:bg-gray-100 hover:text-gray-700 transition duration-300 cursor-pointer">
                <Link href="/Admin/Advanced_Composition">
                  Advanced_Composition
                </Link>
              </li>
              <li className="text-lg text-white p-2 rounded-md shadow-md border hover:bg-gray-100 hover:text-gray-700 transition duration-300 cursor-pointer">
                <Link href="/Admin/SongWriting">SongWriting</Link>
              </li>
              <li className="text-lg text-white p-2 rounded-md shadow-md border hover:bg-gray-100 hover:text-gray-700 transition duration-300 cursor-pointer">
                <Link href="/Admin/Music_Production">Music_Production</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
