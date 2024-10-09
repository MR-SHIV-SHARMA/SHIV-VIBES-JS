"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSlider from "../AdminSlider/page";

import {
  FaSearch,
  FaUser,
  FaPlus,
  FaEllipsisH,
  FaEdit,
  FaTrashAlt,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Admin = () => {
  const [all_courses, setAll_Courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [buttonBgColor, setButtonBgColor] = useState("bg-blue-500");
  const [newCourse, setNewCourse] = useState({
    title: "",
    status: "",
    description: "",
    key_elements: {
      Notes: { description: "", quote: "" },
      Scales: { description: "", quote: "" },
      Chords: { description: "", quote: "" },
      Rhythm: { description: "", quote: "" },
      Melody: { description: "", quote: "" },
      Harmony: { description: "", quote: "" },
      Form: { description: "", quote: "" },
    },
    additional_topics: {
      Intervals: { description: "", quote: "" },
      Dynamics: { description: "", quote: "" },
      Articulation: { description: "", quote: "" },
      Timbre: { description: "", quote: "" },
      SightReading: { description: "", quote: "" },
      EarTraining: { description: "", quote: "" },
    },
    tips_for_beginners: [],
    resources: [],
    conclusion: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `/api/Admin/Basic_Music`
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

  const handleInputChange = (
    e,
    index = null,
    field = null,
    subfield = null
  ) => {
    const { name, value } = e.target;

    if (index !== null && field) {
      // Handle input changes for existing courses
      const updatedCourses = [...all_courses];
      if (subfield) {
        const [nestedField, nestedKey] = subfield.split(".");
        updatedCourses[index][field][nestedField][nestedKey] = value;
      } else {
        updatedCourses[index][field][name] = value;
      }
      setAll_Courses(updatedCourses);
    } else if (index !== null) {
      // Handle input changes for existing courses non-nested fields
      const updatedCourses = [...all_courses];
      if (name === "tips_for_beginners" || name === "resources") {
        updatedCourses[index][name] = value.split("\n");
      } else {
        updatedCourses[index][name] = value;
      }
      setAll_Courses(updatedCourses);
    } else if (field) {
      // Handle input changes for new course's nested fields
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        [field]: {
          ...prevCourse[field],
          [name]: value,
        },
      }));
    } else {
      // Handle input changes for new course non-nested fields
      if (name === "tips_for_beginners" || name === "resources") {
        setNewCourse((prevCourse) => ({
          ...prevCourse,
          [name]: value.split("\n"),
        }));
      } else {
        setNewCourse((prevCourse) => ({
          ...prevCourse,
          [name]: value,
        }));
      }
    }
  };

  const handleInputChangeForCourseAdd = (e, field, subfield) => {
    const { name, value } = e.target;

    if (field && subfield) {
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        [field]: {
          ...prevCourse[field],
          [subfield]: {
            ...prevCourse[field][subfield],
            [name]: value,
          },
        },
      }));
    } else if (field) {
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        [field]: value,
      }));
    } else {
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [field]: value.split("\n"), // Convert string to array
    }));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const saveUpdates = async (course) => {
    const data = JSON.stringify(course);
    const config = {
      method: "PUT",
      url: `/api/Admin/Basic_Music?id=${course._id}`,
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
    } catch (error) {
      toast.error("Failed to update details.");
      console.log(error);
    }
  };

  const deleteCourse = async (_id) => {
    const config = {
      method: "DELETE",
      url: `/api/Admin/Basic_Music?id=${_id}`,
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

  const addCourse = async () => {
    try {
      const response = await axios.post(
        "/api/Admin/Basic_Music",
        newCourse,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Course added successfully!");
      setAll_Courses([...all_courses, response.data.data]);
      setNewCourse({
        title: "",
        status: "",
        description: "",
        key_elements: {
          Notes: { description: "", quote: "" },
          Scales: { description: "", quote: "" },
          Chords: { description: "", quote: "" },
          Rhythm: { description: "", quote: "" },
          Melody: { description: "", quote: "" },
          Harmony: { description: "", quote: "" },
          Form: { description: "", quote: "" },
        },
        additional_topics: {
          Intervals: { description: "", quote: "" },
          Dynamics: { description: "", quote: "" },
          Articulation: { description: "", quote: "" },
          Timbre: { description: "", quote: "" },
          SightReading: { description: "", quote: "" },
          EarTraining: { description: "", quote: "" },
        },
        tips_for_beginners: [], // Reset array
        resources: [],
        conclusion: "",
        status: "", // Reset status field
      });
      setIsDropdownOpen(false); // Close the dropdown after adding the course
    } catch (error) {
      toast.error("Failed to add course.");
      console.error(error);
    }
  };

  // State and handlers for adding a new product

  const [allProducts, setAllProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

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

  // Add a new product
  const addProduct = async () => {
    const data = JSON.stringify(newProduct);
    console.log("Sending data:", data); // Debug log

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/Admin/Basic_Music",
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
        description: "",
        key_elements: {
          Notes: { description: "", quote: "" },
          Scales: { description: "", quote: "" },
          Chords: { description: "", quote: "" },
          Rhythm: { description: "", quote: "" },
          Melody: { description: "", quote: "" },
          Harmony: { description: "", quote: "" },
          Form: { description: "", quote: "" },
        },
        additional_topics: {
          Intervals: { description: "", quote: "" },
          Dynamics: { description: "", quote: "" },
          Articulation: { description: "", quote: "" },
          Timbre: { description: "", quote: "" },
          SightReading: { description: "", quote: "" },
          EarTraining: { description: "", quote: "" },
        },
        tips_for_beginners: [],
        resources: [],
        conclusion: "",
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
      {all_courses.length > 0 ? (
        <>
          <div className="flex">
            <AdminSlider />
            <div className="flex-1 p-6 ml-16 border">
              <div>
                <nav className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-semibold">/Admin/Basic_Music</span>
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
                      className={`cursor-pointer ${
                        filter === status ? "font-bold" : ""
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
                    Add Course
                  </button>

                  {showAddProduct && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                      <div className="bg-white text-black p-8 rounded w-1/2 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                          Add New Course
                        </h2>
                        <form>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Title:
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={newCourse.title}
                              onChange={(e) => handleInputChangeForCourseAdd(e)}
                              required
                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Description:
                            </label>
                            <input
                              type="text"
                              name="description"
                              value={newCourse.description}
                              onChange={(e) => handleInputChangeForCourseAdd(e)}
                              required
                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Conclusion:
                            </label>
                            <input
                              type="text"
                              name="conclusion"
                              value={newCourse.conclusion}
                              onChange={(e) => handleInputChangeForCourseAdd(e)}
                              required
                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {/* Key Elements Section */}
                          <fieldset className="mb-4">
                            <legend className="text-lg font-semibold mb-2">
                              Key Elements:
                            </legend>
                            {Object.keys(newCourse.key_elements).map((key) => (
                              <div key={key} className="mb-4">
                                <h3 className="text-md font-medium mb-1">
                                  {key}
                                </h3>
                                <label className="block text-sm font-medium text-gray-700">
                                  Description:
                                </label>
                                <input
                                  type="text"
                                  name="description"
                                  value={
                                    newCourse.key_elements[key].description
                                  }
                                  onChange={(e) =>
                                    handleInputChangeForCourseAdd(
                                      e,
                                      "key_elements",
                                      key
                                    )
                                  }
                                  className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2">
                                  Quote:
                                </label>
                                <input
                                  type="text"
                                  name="quote"
                                  value={newCourse.key_elements[key].quote}
                                  onChange={(e) =>
                                    handleInputChangeForCourseAdd(
                                      e,
                                      "key_elements",
                                      key
                                    )
                                  }
                                  className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            ))}
                          </fieldset>
                          {/* Additional Topics Section */}
                          <fieldset className="mb-4">
                            <legend className="text-lg font-semibold mb-2">
                              Additional Topics:
                            </legend>
                            {Object.keys(newCourse.additional_topics).map(
                              (key) => (
                                <div key={key} className="mb-4">
                                  <h3 className="text-md font-medium mb-1">
                                    {key}
                                  </h3>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Description:
                                  </label>
                                  <input
                                    type="text"
                                    name="description"
                                    value={
                                      newCourse.additional_topics[key]
                                        .description
                                    }
                                    onChange={(e) =>
                                      handleInputChangeForCourseAdd(
                                        e,
                                        "additional_topics",
                                        key
                                      )
                                    }
                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <label className="block text-sm font-medium text-gray-700 mt-2">
                                    Quote:
                                  </label>
                                  <input
                                    type="text"
                                    name="quote"
                                    value={
                                      newCourse.additional_topics[key].quote
                                    }
                                    onChange={(e) =>
                                      handleInputChangeForCourseAdd(
                                        e,
                                        "additional_topics",
                                        key
                                      )
                                    }
                                    className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              )
                            )}
                          </fieldset>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Tips for Beginners (one per line):
                            </label>
                            <textarea
                              value={newCourse.tips_for_beginners.join("\n")}
                              onChange={(e) =>
                                handleArrayChange(e, "tips_for_beginners")
                              }
                              rows="10"
                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Resources (one per line):
                            </label>
                            <textarea
                              value={newCourse.resources.join("\n")}
                              onChange={(e) =>
                                handleArrayChange(e, "resources")
                              }
                              rows="10"
                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Status:
                            </label>
                            <select
                              name="status"
                              value={newCourse.status}
                              onChange={(e) => handleInputChangeForCourseAdd(e)}
                              required
                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Status</option>
                              <option value="Active">Active</option>
                              <option value="Draft">Draft</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={addCourse}
                              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                              Add Course
                            </button>
                            <button
                              type="button"
                              onClick={closeAddProductForm}
                              className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                              Cancel
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
                  <table className="min-w-full flex">
                    <tbody className="bg-white min-w-full">
                      {currentProducts.map((course, index) => (
                        <tr key={course._id} className="flex flex-col">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-bold">Title:</span>{" "}
                            {course.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-bold">Description:</span>{" "}
                            {course.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                course.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : course.status === "Draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {course.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-bold">Conclusion:</span>{" "}
                            {course.conclusion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="mb-4">
                              <span className="font-bold">Key Elements:</span>
                              {Object.keys(course.key_elements).map((key) => (
                                <div key={key} className="mb-2">
                                  <h3 className="text-lg font-semibold">
                                    {key}
                                  </h3>
                                  <p className="flex items-center mb-2">
                                    <span className="font-bold mr-1">
                                      Description:
                                    </span>
                                    <div className="ml-2 p-2 text-black dark:text-gray-900 flex-1">
                                      {course.key_elements[key].description}
                                    </div>
                                  </p>
                                  <p className="flex items-center mb-2">
                                    <span className="font-bold mr-1">
                                      Quote:
                                    </span>
                                    <div className="ml-2 p-2 text-black dark:text-gray-900 flex-1">
                                      {course.key_elements[key].quote}
                                    </div>
                                  </p>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="mb-4">
                              <span className="font-bold">
                                Additional Topics:
                              </span>
                              {Object.keys(course.additional_topics).map(
                                (key) => (
                                  <div key={key} className="mb-2">
                                    <h3 className="text-lg font-semibold">
                                      {key}
                                    </h3>
                                    <p className="flex items-center mb-2">
                                      <span className="font-bold mr-1">
                                        Description:
                                      </span>
                                      <div className="ml-2 p-2 text-black dark:text-gray-900 flex-1">
                                        {
                                          course.additional_topics[key]
                                            .description
                                        }
                                      </div>
                                    </p>
                                    <p className="flex items-center mb-2">
                                      <span className="font-bold mr-1">
                                        Quote:
                                      </span>
                                      <div className="ml-2 p-2 text-black dark:text-gray-900 flex-1">
                                        {course.additional_topics[key].quote}
                                      </div>
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <p className="flex flex-col mb-4">
                              <span className="font-bold mb-2">
                                Tips for beginners:
                              </span>
                              <div className="ml-2 p-2 text-black dark:text-gray-900 flex-1">
                                {course.tips_for_beginners.map(
                                  (resources, index) => (
                                    <div key={index} className="mb-1">
                                      {resources}
                                    </div>
                                  )
                                )}
                              </div>
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <p className="flex flex-col mb-4">
                              <span className="font-bold mb-2">Resources:</span>
                              <div className="ml-2 p-2 text-black dark:text-gray-900 flex-1">
                                {course.resources.map((resource, index) => (
                                  <div key={index} className="mb-1">
                                    {resource}
                                  </div>
                                ))}
                              </div>
                            </p>
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
                                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
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
                                                  value={course.title}
                                                  onChange={(e) =>
                                                    handleInputChange(e, index)
                                                  }
                                                  required
                                                  className="border border-gray-300 p-2 w-full"
                                                />
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Description:
                                                </label>
                                                <textarea
                                                  name="description"
                                                  value={course.description}
                                                  onChange={(e) =>
                                                    handleInputChange(e, index)
                                                  }
                                                  required
                                                  className="border border-gray-300 p-2 w-full"
                                                />
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Status:
                                                </label>
                                                <select
                                                  name="status"
                                                  value={course.status}
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
                                              {/* <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Status:
                                                </label>
                                                <select
                                                  name="status"
                                                  value={course.status}
                                                  onChange={(e) =>
                                                    handleInputChange(e, index)
                                                  }
                                                  className="border border-gray-300 p-2 w-full"
                                                >
                                                  <option value="Active">
                                                    Active
                                                  </option>
                                                  <option value="Draft">
                                                    Draft
                                                  </option>
                                                  <option value="Inactive">
                                                    Inactive
                                                  </option>
                                                </select>
                                              </div> */}
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Conclusion:
                                                </label>
                                                <textarea
                                                  name="conclusion"
                                                  value={course.conclusion}
                                                  onChange={(e) =>
                                                    handleInputChange(e, index)
                                                  }
                                                  required
                                                  className="border border-gray-300 p-2 w-full"
                                                />
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Key Elements:
                                                </label>
                                                {Object.keys(
                                                  course.key_elements
                                                ).map((key) => (
                                                  <div
                                                    key={key}
                                                    className="mb-2"
                                                  >
                                                    <h3 className="text-lg font-semibold">
                                                      {key}
                                                    </h3>
                                                    <p className="flex items-center mb-2">
                                                      <span className="font-bold mr-1">
                                                        Description:
                                                      </span>
                                                      <input
                                                        type="text"
                                                        name="description"
                                                        value={
                                                          course.key_elements[
                                                            key
                                                          ].description
                                                        }
                                                        onChange={(e) =>
                                                          handleInputChange(
                                                            e,
                                                            index,
                                                            "key_elements",
                                                            `${key}.description`
                                                          )
                                                        }
                                                        className="border border-gray-300 p-2 w-full"
                                                      />
                                                    </p>
                                                    <p className="flex items-center mb-2">
                                                      <span className="font-bold mr-1">
                                                        Quote:
                                                      </span>
                                                      <input
                                                        type="text"
                                                        name="quote"
                                                        value={
                                                          course.key_elements[
                                                            key
                                                          ].quote
                                                        }
                                                        onChange={(e) =>
                                                          handleInputChange(
                                                            e,
                                                            index,
                                                            "key_elements",
                                                            `${key}.quote`
                                                          )
                                                        }
                                                        className="border border-gray-300 p-2 w-full"
                                                      />
                                                    </p>
                                                  </div>
                                                ))}
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Additional Topics:
                                                </label>
                                                {Object.keys(
                                                  course.additional_topics
                                                ).map((key) => (
                                                  <div
                                                    key={key}
                                                    className="mb-2"
                                                  >
                                                    <h3 className="text-lg font-semibold">
                                                      {key}
                                                    </h3>
                                                    <p className="flex items-center mb-2">
                                                      <span className="font-bold mr-1">
                                                        Description:
                                                      </span>
                                                      <input
                                                        type="text"
                                                        name="description"
                                                        value={
                                                          course
                                                            .additional_topics[
                                                            key
                                                          ].description
                                                        }
                                                        onChange={(e) =>
                                                          handleInputChange(
                                                            e,
                                                            index,
                                                            "additional_topics",
                                                            `${key}.description`
                                                          )
                                                        }
                                                        className="border border-gray-300 p-2 w-full"
                                                      />
                                                    </p>
                                                    <p className="flex items-center mb-2">
                                                      <span className="font-bold mr-1">
                                                        Quote:
                                                      </span>
                                                      <input
                                                        type="text"
                                                        name="quote"
                                                        value={
                                                          course
                                                            .additional_topics[
                                                            key
                                                          ].quote
                                                        }
                                                        onChange={(e) =>
                                                          handleInputChange(
                                                            e,
                                                            index,
                                                            "additional_topics",
                                                            `${key}.quote`
                                                          )
                                                        }
                                                        className="border border-gray-300 p-2 w-full"
                                                      />
                                                    </p>
                                                  </div>
                                                ))}
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Tips for beginners:
                                                </label>
                                                <textarea
                                                  name="tips_for_beginners"
                                                  value={course.tips_for_beginners.join(
                                                    "\n"
                                                  )}
                                                  onChange={(e) =>
                                                    handleInputChange(e, index)
                                                  }
                                                  className="border border-gray-300 p-2 w-full"
                                                  rows="4"
                                                />
                                              </div>
                                              <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                  Resources:
                                                </label>
                                                <textarea
                                                  name="resources"
                                                  value={course.resources.join(
                                                    "\n"
                                                  )}
                                                  onChange={(e) =>
                                                    handleInputChange(e, index)
                                                  }
                                                  className="border border-gray-300 p-2 w-full"
                                                  rows="4"
                                                />
                                              </div>
                                              <div className="flex justify-end">
                                                <button
                                                  type="button"
                                                  onClick={closeAddProductForm}
                                                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  type="submit"
                                                  className="bg-blue-500 text-white px-4 py-2 rounded"
                                                  onClick={() =>
                                                    saveUpdates(course)
                                                  }
                                                >
                                                  Save
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex justify-between mt-4">
                                      <button
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                        onClick={() => deleteCourse(course._id)}
                                      >
                                        <FaTrash className="mr-2" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <hr className="border" />
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
                    className={`bg-gray-400 text-white px-2 py-1 rounded flex items-center ${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft className="mr-2" />
                    Prev
                  </button>
                  <button
                    className={`bg-gray-400 text-white px-2 py-1 rounded flex items-center ${
                      indexOfLastProduct >= filteredProducts.length
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
        </>
      ) : (
        <p>No course data available.</p>
      )}
    </div>
  );
};

export default Admin;
