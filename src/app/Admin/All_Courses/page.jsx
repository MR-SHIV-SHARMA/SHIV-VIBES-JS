"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSearch,
  FaUser,
  FaPlus,
  FaEllipsisH,
  FaEdit,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import AdminSlider from "../AdminSlider/page";

const Admin = () => {
  // State to hold courses data
  const [all_courses, setAll_Courses] = useState([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State for button background color
  const [buttonBgColor, setButtonBgColor] = useState("bg-blue-500");
  // State for new course data
  const [newCourse, setNewCourse] = useState({
    title: "",
    status: "",
    slug: "",
    description: "",
    price: 0,
    instructor: "",
    isFeatured: false,
    isFree: false,
    thumbnail: "",
    videoUrl: "",
    totalDuration: "",
    accessPeriod: "",
    videos: [
      {
        title: "",
        duration: "",
        intro: "",
        description: "",
        videoUrl: "",
      },
    ],
    totalSales: 0,
    createdAt: new Date(),
  });

  // Fetch courses data on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `/api/Admin/All_Courses`
        );
        setAll_Courses(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.error : error.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle input changes for new course and existing courses
  const handleInputChange = (e, courseIndex, isVideo = false, videoIndex = null) => {
    const { name, value } = e.target;

    if (isVideo && videoIndex !== null) {
      // Update video details
      setAll_Courses((prevCourses) => {
        const updatedCourses = [...prevCourses];
        const updatedVideos = [...updatedCourses[courseIndex].videos];
        updatedVideos[videoIndex] = {
          ...updatedVideos[videoIndex],
          [name]: name === "intro" ? value === "true" : value, // Convert intro to boolean
        };
        updatedCourses[courseIndex] = {
          ...updatedCourses[courseIndex],
          videos: updatedVideos,
        };
        return updatedCourses;
      });
    } else if (courseIndex !== undefined) {
      // Update existing course details
      const updatedCourses = [...all_courses];
      updatedCourses[courseIndex] = {
        ...updatedCourses[courseIndex],
        [name]: name === "price" ? Number(value) : value,
      };
      setAll_Courses(updatedCourses);
    } else {
      // Update new course details
      setNewCourse({
        ...newCourse,
        [name]: name === "price" ? Number(value) : value,
      });
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Save updates to a course
  const saveUpdates = async (course) => {
    const data = JSON.stringify(course);
    const config = {
      method: "PUT",
      url: `/api/Admin/All_Courses?id=${course._id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      toast.success("Details updated successfully!");
      setButtonBgColor("bg-green-500");
      console.log(JSON.stringify(response.data));
      closeAddProductForm();
      setShowActions(false);
    } catch (error) {
      toast.error("Failed to update details.");
      console.log(error);
    }
  };

  // Delete a course
  const deleteCourse = async (_id) => {
    const config = {
      method: "DELETE",
      url: `/api/Admin/All_Courses?id=${_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.request(config);
      toast.success("Course deleted successfully!");
      setAll_Courses(all_courses.filter((course) => course._id !== _id));
    } catch (error) {
      toast.error("Failed to delete course.");
      console.log(error);
    }
  };

  // State and handlers for adding a new product
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    title: "",
    status: "",
    slug: "",
    description: "",
    price: 0,
    instructor: "",
    isFeatured: false,
    isFree: false,
    thumbnail: "",
    videoUrl: "",
    totalDuration: "",
    accessPeriod: "",
    videos: [
      {
        title: "",
        duration: "",
        intro: "",
        description: "",
        videoUrl: "",
      },
    ],
    totalSales: 0,
  });
  const [allProducts, setAllProducts] = useState([]);

  const openAddProductForm = () => {
    setShowAddProduct(true);
  };

  const closeAddProductForm = () => {
    setShowAddProduct(false);
  };

  // Handle changes in new product form
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle changes in video details of new product
  const handleVideoInputChange = (index, e) => {
    const { name, value } = e.target;
    const newVideos = [...newProduct.videos];
    newVideos[index] = { ...newVideos[index], [name]: value };
    setNewProduct({ ...newProduct, videos: newVideos });
  };

  // Add a new video to the product
  const addVideo = () => {
    setNewProduct({
      ...newProduct,
      videos: [
        ...newProduct.videos,
        {
          title: "",
          duration: "",
          intro: "",
          description: "",
          videoUrl: "",
        },
      ],
    });
  };

  // Remove a video from the product
  const removeVideo = (index) => {
    const newVideos = newProduct.videos.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, videos: newVideos });
  };

  // Add a new product
  const addProduct = async () => {
    const data = JSON.stringify({
      ...newProduct,
      createdAt: new Date(), // Add createdAt field
    });
    console.log("Sending data:", data); // Debug log

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/Admin/All_Courses",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Response:", response.data); // Debug log
      toast.success("Product added successfully!");
      setAllProducts([...allProducts, response.data.data]);
      setNewProduct({
        title: "",
        status: "",
        slug: "",
        description: "",
        price: 0,
        instructor: "",
        isFeatured: false,
        isFree: false,
        thumbnail: "",
        videoUrl: "",
        totalDuration: "",
        accessPeriod: "",
        videos: [
          {
            title: "",
            duration: "",
            intro: "",
            description: "",
            videoUrl: "",
          },
        ],
        totalSales: 0,
      });
      closeAddProductForm();
    } catch (error) {
      console.log("Error:", error); // Debug log
      toast.error("Failed to add product.");
    }
  };

  // State and handlers for product actions and filtering
  const [showActions, setShowActions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const productsPerPage = 5;

  // Toggle action menu visibility
  const handleEllipsisClick = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      setShowActions(false);
    } else {
      setActiveIndex(index);
      setShowActions(true);
    }
  };

  // Filter products based on status and search query
  const filteredProducts = all_courses
    .filter((product) => {
      if (filter === "All") return true;
      return product.status === filter;
    })
    .filter((product) => {
      const title = product.title || ""; // Fallback to empty string if title is undefined
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Conditional rendering for loading and error states
  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4">Error: {error}</p>;

  return (
    <div className="w-fit min-h-screen bg-gray-300 text-gray-700">
      <ToastContainer />
      <div className="flex">
        <AdminSlider />
        <div className="flex-1 p-6 ml-16 border">
          <div>
            <nav className="flex justify-between items-center mb-4">
              <div>
                <span className="font-semibold">/admin/dashboard</span>
              </div>
              <div className="flex space-x-4 items-center">
                <div className="flex items-center bg-white p-2 rounded">
                  <FaSearch className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <span className="flex items-center">
                  <div className="mr-2 text-gray-500 text-2xl border border-gray-500 rounded-full p-2">
                    <FaUser />
                  </div>
                </span>
              </div>
            </nav>
          </div>

          <div className="flex justify-between mb-4">
            <div className="flex space-x-4">
              {["All", "Active", "Draft", "Archived"].map((status) => (
                <span
                  key={status}
                  className={`cursor-pointer ${filter === status ? "font-bold" : ""
                    }`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                onClick={openAddProductForm}
              >
                <FaPlus className="mr-2" />
                Add Product
              </button>

              {showAddProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                  <div className="bg-white text-black p-8 rounded w-1/2 max-h-screen overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                      Add New Product
                    </h2>
                    <form>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Title:
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newProduct.title}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          slug:
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={newProduct.slug}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Description:
                        </label>
                        <textarea
                          name="description"
                          value={newProduct.description}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Price:
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.price}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Status:
                        </label>
                        <select
                          name="status"
                          value={newProduct.status}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Instructor:
                        </label>
                        <input
                          type="text"
                          name="instructor"
                          value={newProduct.instructor}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          isFeatured:
                        </label>
                        <select
                          name="isFeatured"
                          value={newProduct.isFeatured.toString()}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              isFeatured: e.target.value === "true",
                            })
                          }
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select One</option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          isFree:
                        </label>
                        <select
                          name="isFree"
                          value={newProduct.isFree.toString()}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              isFree: e.target.value === "true",
                            })
                          }
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select One</option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          totalDuration:
                        </label>
                        <input
                          type="text"
                          name="totalDuration"
                          value={newProduct.totalDuration}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          accessPeriod:
                        </label>
                        <input
                          type="text"
                          name="accessPeriod"
                          value={newProduct.accessPeriod}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Thumbnail URL:
                        </label>
                        <input
                          type="text"
                          name="thumbnail"
                          value={newProduct.thumbnail}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Video URL:
                        </label>
                        <input
                          type="text"
                          name="videoUrl"
                          value={newProduct.videoUrl}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Total Sales:
                        </label>
                        <input
                          type="number"
                          name="totalSales"
                          value={newProduct.totalSales}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Created At:
                        </label>
                        <input
                          type="text"
                          name="createdAt"
                          value={newProduct.createdAt}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Videos:
                        </label>
                        {newProduct.videos.map((video, index) => (
                          <div
                            key={index}
                            className="border p-4 mb-4 rounded-md"
                          >
                            <h3 className="text-lg font-semibold mb-2">
                              Video {index + 1}
                            </h3>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Title:
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={video.title}
                                onChange={(e) =>
                                  handleVideoInputChange(index, e)
                                }
                                required
                                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Duration:
                              </label>
                              <input
                                type="text"
                                name="duration"
                                value={video.duration}
                                onChange={(e) =>
                                  handleVideoInputChange(index, e)
                                }
                                required
                                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Intro:
                              </label>
                              <select
                                name="intro"
                                value={video.intro}
                                onChange={(e) =>
                                  handleVideoInputChange(index, {
                                    target: {
                                      name: "intro",
                                      value: e.target.value === "true",
                                    },
                                  })
                                }
                                required
                                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Description:
                              </label>
                              <textarea
                                name="description"
                                value={video.description}
                                onChange={(e) =>
                                  handleVideoInputChange(index, e)
                                }
                                required
                                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Video URL:
                              </label>
                              <input
                                type="text"
                                name="videoUrl"
                                value={video.videoUrl}
                                onChange={(e) =>
                                  handleVideoInputChange(index, e)
                                }
                                required
                                className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            >
                              Remove Video
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addVideo}
                          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                        >
                          Add Another Video
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="bg-gray-400 text-white px-4 py-2 rounded mr-2 transition duration-300 ease-in-out hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          onClick={closeAddProductForm}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={addProduct} // Call the addProduct function directly
                          className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Add Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-full bg-gray-50 p-6 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Products
              </h1>
              <p className="text-lg text-gray-600">
                Manage your products and view their sales performance.
              </p>
              <hr className="border-t-2 border-gray-300 my-4" />
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thumbnail
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      VideoUrl
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Instructor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      slug
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      isFeatured
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      isFree
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      totalDuration
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      accessPeriod
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Sales
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        videos.Title
                      </th>
                      <th
                        scope="col"
                        className="pl-16 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        videos.Duration
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        videos.Intro
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        videos.Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 pl-36 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        videos.Video URL
                      </th>
                    </div>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={product.thumbnail} // Assuming `product.image` holds the image URL
                              alt={product.title}
                              width={40} // Set the width of your image
                              height={40} // Set the height of your image
                              className="rounded-full" // Make the image rounded
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.videoUrl}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $
                        {product.price !== undefined
                          ? product.price.toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.instructor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.isFeatured ? "True" : "False"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.isFree ? "Free" : "Paid"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.totalDuration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.accessPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.totalSales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.videos && product.videos.length > 0 ? (
                          product.videos.map((video, index) => (
                            <div key={index} className="mb-2">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {video.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {video.duration}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {video.intro ? "Yes" : "No"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {video.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <a
                                  href={video.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  {video.videoUrl}
                                </a>
                              </td>
                            </div>
                          ))
                        ) : (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            No videos available
                          </td>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                              id="options-menu"
                              aria-expanded="true"
                              onClick={() => handleEllipsisClick(index)}
                            >
                              <FaEllipsisH className="h-5 w-5" />
                            </button>
                          </div>
                          {showActions && activeIndex === index && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                              >
                                <div className="flex justify-between mt-4">
                                  <button
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                    onClick={openAddProductForm}
                                  >
                                    <FaEdit className="mr-2" />
                                    Edit
                                  </button>

                                  {showAddProduct && (
                                    <div
                                      // ref={MenudropdownRef}
                                      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
                                    >
                                      <div className="bg-white text-black p-8 rounded w-1/2 max-h-screen overflow-y-auto">
                                        <h2 className="text-xl font-semibold mb-4">
                                          Edit Product
                                        </h2>
                                        <form>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Title:
                                            </label>
                                            <input
                                              type="text"
                                              name="title"
                                              value={product.title}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Description:
                                            </label>
                                            <textarea
                                              name="description"
                                              value={product.description}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Price:
                                            </label>
                                            <input
                                              type="number"
                                              name="price"
                                              value={product.price}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Status:
                                            </label>
                                            <select
                                              name="status"
                                              value={product.status}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                              <option value="">
                                                Select Status
                                              </option>
                                              <option value="Active">
                                                Active
                                              </option>
                                              <option value="Draft">
                                                Draft
                                              </option>
                                              <option value="Archived">
                                                Archived
                                              </option>
                                            </select>
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Instructor:
                                            </label>
                                            <input
                                              type="text"
                                              name="instructor"
                                              value={product.instructor}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Image URL:
                                            </label>
                                            <input
                                              type="text"
                                              name="thumbnail"
                                              value={product.thumbnail}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Video URL:
                                            </label>
                                            <input
                                              type="text"
                                              name="videoUrl"
                                              value={product.videoUrl}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              slug:
                                            </label>
                                            <input
                                              type="text"
                                              name="slug"
                                              value={product.slug}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              isFeatured:
                                            </label>
                                            <select
                                              name="isFeatured"
                                              value={
                                                product.isFeatured
                                                  ? "true"
                                                  : "false"
                                              }
                                              onChange={(e) =>
                                                handleInputChange(
                                                  {
                                                    target: {
                                                      name: e.target.name,
                                                      value:
                                                        e.target.value ===
                                                        "true",
                                                    },
                                                  },
                                                  index
                                                )
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                              <option value="">
                                                Select One
                                              </option>
                                              <option value="true">True</option>
                                              <option value="false">
                                                False
                                              </option>
                                            </select>
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              isFree:
                                            </label>
                                            <select
                                              name="isFree"
                                              value={
                                                product.isFree
                                                  ? "true"
                                                  : "false"
                                              }
                                              onChange={(e) =>
                                                handleInputChange(
                                                  {
                                                    target: {
                                                      name: e.target.name,
                                                      value:
                                                        e.target.value ===
                                                        "true",
                                                    },
                                                  },
                                                  index
                                                )
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                              <option value="">
                                                Select One
                                              </option>
                                              <option value="true">Free</option>
                                              <option value="false">
                                                Paid
                                              </option>
                                            </select>
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              totalDuration:
                                            </label>
                                            <input
                                              type="text"
                                              name="totalDuration"
                                              value={product.totalDuration}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              accessPeriod:
                                            </label>
                                            <input
                                              type="text"
                                              name="accessPeriod"
                                              value={product.accessPeriod}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Total Sales:
                                            </label>
                                            <input
                                              type="number"
                                              name="totalSales"
                                              value={product.totalSales}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Created At:
                                            </label>
                                            <input
                                              type="text"
                                              name="createdAt"
                                              value={product.createdAt}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            {product.videos.map((video, videoIndex) => (
                                              <div key={videoIndex} className="mb-4">
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium text-gray-700">
                                                    Video Title:
                                                  </label>
                                                  <input
                                                    type="text"
                                                    name="title"
                                                    value={video.title}
                                                    onChange={(e) => handleInputChange(e, index, true, videoIndex)}
                                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  />
                                                </div>
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium text-gray-700">
                                                    Video Duration:
                                                  </label>
                                                  <input
                                                    type="text"
                                                    name="duration"
                                                    value={video.duration}
                                                    onChange={(e) => handleInputChange(e, index, true, videoIndex)}
                                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  />
                                                </div>
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium text-gray-700">
                                                    Video Intro:
                                                  </label>
                                                  <select
                                                    name="intro"
                                                    value={video.intro ? "true" : "false"}
                                                    onChange={(e) => handleInputChange(e, index, true, videoIndex)}
                                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  >
                                                    <option value="true">True</option>
                                                    <option value="false">False</option>
                                                  </select>
                                                </div>
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium text-gray-700">
                                                    Video Description:
                                                  </label>
                                                  <textarea
                                                    name="description"
                                                    value={video.description}
                                                    onChange={(e) => handleInputChange(e, index, true, videoIndex)}
                                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  />
                                                </div>
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium text-gray-700">
                                                    Video URL:
                                                  </label>
                                                  <input
                                                    type="text"
                                                    name="videoUrl"
                                                    value={video.videoUrl}
                                                    onChange={(e) => handleInputChange(e, index, true, videoIndex)}
                                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          <div className="flex justify-end">
                                            <button
                                              type="button"
                                              className="bg-gray-400 text-white px-4 py-2 rounded mr-2 transition duration-300 ease-in-out hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                              onClick={closeAddProductForm}
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                saveUpdates(product)
                                              }
                                              className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => deleteCourse(product._id)}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                >
                                  <FaTrashAlt className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <div>
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>
            <div className="flex space-x-2">
              <button
                className={`bg-gray-400 text-white px-2 py-1 rounded flex items-center ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="mr-2" />
                Prev
              </button>
              <button
                className={`bg-gray-400 text-white px-2 py-1 rounded flex items-center ${indexOfLastProduct >= filteredProducts.length
                  ? "pointer-events-none opacity-50"
                  : ""
                  }`}
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastProduct >= filteredProducts.length}
              >
                Next
                <FaChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
