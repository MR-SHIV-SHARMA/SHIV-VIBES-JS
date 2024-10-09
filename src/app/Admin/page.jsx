"use client";
import React, { useState } from "react";
import Image from "next/image";
import AdminSlider from "../../app/Admin/AdminSlider/page";

function Admin() {
  return (
    <div className="w-full min-h-screen bg-gray-300 text-gray-700">
      <div className="flex">
        <AdminSlider />
        <div className="relative flex-1 min-h-screen ml-16 border">
          <div className="absolute inset-0">
            <Image
              src="/pexels-pok-rie-33563-5799946.jpg"
              alt="Your Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-opacity-80 bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Admin Dashboard!
            </h1>
            <p className="text-lg text-center">
              Manage your products, orders, and settings with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
