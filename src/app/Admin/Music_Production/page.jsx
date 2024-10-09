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

const Music_Production = () => {
  // State to hold courses data
  const [all_courses, setAll_Courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for new course data
  const [newCourse, setNewCourse] = useState({
    title: "",
    status: "",
    content: "",
    image: "",
  });

  // Fetch courses data on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/Admin/Music_Production`);
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
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    if (index !== undefined) {
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

  // Save updates to a course
  const saveUpdates = async (course) => {
    const data = JSON.stringify(course);
    const config = {
      method: "PUT",
      url: `/api/Admin/Music_Production?id=${course._id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      toast.success("Details updated successfully!");
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
      url: `/api/Admin/Music_Production?id=${_id}`,
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
    title: "",
    status: "",
    content: "",
    image: "",
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

  // Add a new product
  const addProduct = async () => {
    const data = JSON.stringify(newProduct);
    console.log("Sending data:", data); // Debug log

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/Admin/Music_Production",
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
        content: "",
        image: "",
      });
      closeAddProductForm();
    } catch (error) {
      console.log("Error:", error); // Debug log
      toast.error("Failed to add product.");
    }
  };

  // Handle search input changes
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle action menu visibility
  const [showActions, setShowActions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
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
  const [filter, setFilter] = useState("All");
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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50;

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
                <span className="font-semibold">/Admin/Music_Production</span>
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
                          title:
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
                          content:
                        </label>
                        <input
                          type="text"
                          name="content"
                          value={newProduct.content}
                          onChange={handleProductInputChange}
                          required
                          className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          image:
                        </label>
                        <input
                          type="text"
                          name="image"
                          value={newProduct.image}
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
                      image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      title
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
                      content
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
                        <Image
                          src={product.image}
                          alt="Product Image"
                          width={56} // Example width
                          height={56} // Example height
                          className="object-cover rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.title}
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
                        {product.content}
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
                                              Content:
                                            </label>
                                            <input
                                              type="text"
                                              name="content"
                                              value={product.content}
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              required
                                              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                          </div>
                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                              Image:
                                            </label>
                                            <input
                                              type="text"
                                              name="image"
                                              value={product.image}
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
              Showing of{" "}
              {filteredProducts.length} products
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music_Production;
