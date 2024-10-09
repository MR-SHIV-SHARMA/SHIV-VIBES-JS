/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const MusicProductionComponent = () => {
  const [musicProductionData, setMusicProductionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/Admin/Music_Production`);
        if (response.data.success) {
          setMusicProductionData(response.data.data);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response ? err.response.data.error : err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (musicProductionData.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className="bg-gray-900 text-white shadow-lg rounded-lg p-6">
      {musicProductionData.map((topic, index) => {
        // Split the content string into an array based on `.,`
        const contentArray = topic.content.split(/\.\s+/).filter(Boolean);

        return (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
            <ul className="space-y-2">
              {contentArray.length > 0 ? (
                contentArray.map((paragraph, idx) => (
                  <li key={idx} className="text-gray-300 mb-1">
                    {paragraph}
                  </li>
                ))
              ) : (
                <li className="text-gray-300 mb-1">Content is not available</li>
              )}
            </ul>
            <div className="mt-4">
              <Image
                src={topic.image} // Correctly use topic.image
                alt={topic.title} // Use topic.title for alt text
                width={800} // Example width, adjust as needed
                height={600} // Example height, adjust as needed
                className="rounded-lg w-full h-auto max-h-60 object-cover"
              />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MusicProductionComponent;
