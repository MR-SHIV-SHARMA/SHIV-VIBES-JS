"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
    _id: "",
    Defining_Composition_Structure: "",
    Starting_Points: "",
    Planning_and_Parameters: "",
    Techniques_and_Resources: "",
    Collaboration_and_Chance: "",
    Workshops_and_Education: "",
    Advanced_Music_Theory: "",
    Experimental_Approaches: "",
    Cultural_Context: "",
    Portfolio_Development: "",
    Performance_and_Interpretation: "",
    Technology_in_Composition: "",
    Ethical_Considerations: "",
  });

  // Fetch courses data on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `/api/Admin/Advanced_Composition`
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
  const handleInputChange = (e, index, isVideo = false) => {
    const { name, value } = e.target;

    if (isVideo && index !== undefined) {
      // Update video details
      setNewProduct((prevProduct) => {
        const updatedVideos = [...prevProduct.videos];
        updatedVideos[index] = {
          ...updatedVideos[index],
          [name]: name === "intro" ? value === "true" : value, // Convert intro to boolean
        };
        return { ...prevProduct, videos: updatedVideos };
      });
    } else if (index !== undefined) {
      // Update existing course details
      const updatedCourses = [...all_courses];
      updatedCourses[index] = {
        ...updatedCourses[index],
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
      url: `/api/Admin/Advanced_Composition?id=${course._id}`,
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
      url: `/api/Admin/Advanced_Composition?id=${_id}`,
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
    _id: "",
    Defining_Composition_Structure: "",
    Starting_Points: "",
    Planning_and_Parameters: "",
    Techniques_and_Resources: "",
    Collaboration_and_Chance: "",
    Workshops_and_Education: "",
    Advanced_Music_Theory: "",
    Experimental_Approaches: "",
    Cultural_Context: "",
    Portfolio_Development: "",
    Performance_and_Interpretation: "",
    Technology_in_Composition: "",
    Ethical_Considerations: "",
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
    const data = JSON.stringify(newProduct);
    console.log("Sending data:", data); // Debug log

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/Admin/Advanced_Composition",
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
        _id: "",
        Defining_Composition_Structure: "",
        Starting_Points: "",
        Planning_and_Parameters: "",
        Techniques_and_Resources: "",
        Collaboration_and_Chance: "",
        Workshops_and_Education: "",
        Advanced_Music_Theory: "",
        Experimental_Approaches: "",
        Cultural_Context: "",
        Portfolio_Development: "",
        Performance_and_Interpretation: "",
        Technology_in_Composition: "",
        Ethical_Considerations: "",
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
  const filteredProducts = (all_courses || []) // Ensure all_courses is an array
    .filter((product) => {
      // Check if filter is "All" or if product status matches the filter
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
                          _id:
                        </label>
                        <input
                          type="text"
                          name="_id"
                          value={newProduct._id}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Defining_Composition_Structure:
                        </label>
                        <input
                          type="text"
                          name="Defining_Composition_Structure"
                          value={newProduct.Defining_Composition_Structure}
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
                          Starting_Points:
                        </label>
                        <input
                          type="text"
                          name="Starting_Points"
                          value={newProduct.Starting_Points}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Planning_and_Parameters:
                        </label>
                        <input
                          type="text"
                          name="Planning_and_Parameters"
                          value={newProduct.Planning_and_Parameters}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Techniques_and_Resources:
                        </label>
                        <input
                          type="text"
                          name="Techniques_and_Resources"
                          value={newProduct.Techniques_and_Resources}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Collaboration_and_Chance:
                        </label>
                        <input
                          type="text"
                          name="Collaboration_and_Chance"
                          value={newProduct.Collaboration_and_Chance}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Workshops_and_Education:
                        </label>
                        <input
                          type="text"
                          name="Workshops_and_Education"
                          value={newProduct.Workshops_and_Education}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Advanced_Music_Theory:
                        </label>
                        <input
                          type="text"
                          name="Advanced_Music_Theory"
                          value={newProduct.Advanced_Music_Theory}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Experimental_Approaches:
                        </label>
                        <input
                          type="text"
                          name="Experimental_Approaches"
                          value={newProduct.Experimental_Approaches}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Cultural_Context:
                        </label>
                        <input
                          type="text"
                          name="Cultural_Context"
                          value={newProduct.Cultural_Context}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Portfolio_Development:
                        </label>
                        <input
                          type="text"
                          name="Portfolio_Development"
                          value={newProduct.Portfolio_Development}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Performance_and_Interpretation:
                        </label>
                        <input
                          type="text"
                          name="Performance_and_Interpretation"
                          value={newProduct.Performance_and_Interpretation}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Technology_in_Composition:
                        </label>
                        <input
                          type="text"
                          name="Technology_in_Composition"
                          value={newProduct.Technology_in_Composition}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Ethical_Considerations:
                        </label>
                        <input
                          type="text"
                          name="Ethical_Considerations"
                          value={newProduct.Ethical_Considerations}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                      _id
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Defining_Composition_Structure
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Starting_Points
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
                      Planning_and_Parameters
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Techniques_and_Resources
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Collaboration_and_Chance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Workshops_and_Education
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Advanced_Music_Theory
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Experimental_Approaches
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cultural_Context
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Portfolio_Development
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Performance_and_Interpretation
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Technology_in_Composition
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ethical_Considerations
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Defining_Composition_Structure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Starting_Points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === "Active"
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
                        {product.Planning_and_Parameters}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Techniques_and_Resources}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Collaboration_and_Chance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Workshops_and_Education}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Advanced_Music_Theory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Experimental_Approaches}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Cultural_Context}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Portfolio_Development}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Performance_and_Interpretation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Technology_in_Composition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.Ethical_Considerations}
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.totalSales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.createdAt}
                      </td> */}
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
                                              Defining Composition Structure:
                                            </label>
                                            <input
                                              type="text"
                                              name="Defining_Composition_Structure"
                                              value={
                                                product.Defining_Composition_Structure
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Starting Points:
                                            </label>
                                            <input
                                              type="text"
                                              name="Starting_Points"
                                              value={product.Starting_Points}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Planning and Parameters:
                                            </label>
                                            <input
                                              type="text"
                                              name="Planning_and_Parameters"
                                              value={
                                                product.Planning_and_Parameters
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Techniques and Resources:
                                            </label>
                                            <input
                                              type="text"
                                              name="Techniques_and_Resources"
                                              value={
                                                product.Techniques_and_Resources
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Collaboration and Chance:
                                            </label>
                                            <input
                                              type="text"
                                              name="Collaboration_and_Chance"
                                              value={
                                                product.Collaboration_and_Chance
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Workshops and Education:
                                            </label>
                                            <input
                                              type="text"
                                              name="Workshops_and_Education"
                                              value={
                                                product.Workshops_and_Education
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Advanced Music Theory:
                                            </label>
                                            <input
                                              type="text"
                                              name="Advanced_Music_Theory"
                                              value={
                                                product.Advanced_Music_Theory
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Experimental Approaches:
                                            </label>
                                            <input
                                              type="text"
                                              name="Experimental_Approaches"
                                              value={
                                                product.Experimental_Approaches
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Cultural Context:
                                            </label>
                                            <input
                                              type="text"
                                              name="Cultural_Context"
                                              value={product.Cultural_Context}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Portfolio Development:
                                            </label>
                                            <input
                                              type="text"
                                              name="Portfolio_Development"
                                              value={
                                                product.Portfolio_Development
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Performance and Interpretation:
                                            </label>
                                            <input
                                              type="text"
                                              name="Performance_and_Interpretation"
                                              value={
                                                product.Performance_and_Interpretation
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Technology in Composition:
                                            </label>
                                            <input
                                              type="text"
                                              name="Technology_in_Composition"
                                              value={
                                                product.Technology_in_Composition
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Ethical Considerations:
                                            </label>
                                            <input
                                              type="text"
                                              name="Ethical_Considerations"
                                              value={
                                                product.Ethical_Considerations
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
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
    </div>
  );
};

export default Admin;
